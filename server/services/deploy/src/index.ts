import { commandOptions, createClient } from "redis";
import path from "path";
import { downloadS3Folder, uploadFinalDist } from "./aws";
import { buildProject, installDependencies } from "./project-builder";
const subscriber = createClient();
const publisher = createClient();
subscriber.connect();
publisher.connect();

async function main() {
  while (true) {
    const popedId = await subscriber.brPop(
      commandOptions({ isolated: true }),
      "build-queue",
      0,
    );
    console.log(popedId);
    if (popedId) {
      const { key, element } = popedId;
      if (key === "build-queue") {
        const bucket = "souviksbasket1";
        const prefix = "repos/" + element;
        console.log("Building project", element);

        /* 
          __dirname = /home/runner/work/reploy/reploy/server/services/deploy/src
          element = ""198HU","
          folderPath = /home/runner/work/reploy/reploy/server/services/deploy/src/../repos/198HU
        */
        const folderPath = path.join(__dirname, "repos", element);
        // Download from S3
        console.log("🔽 Downloading from S3...");
        await downloadS3Folder(bucket, prefix, folderPath);
        console.log("✅ Downloaded from S3");
        console.log("folder saved at", folderPath);

        // Install dependencies
        console.log("🔽 Installing dependencies...");
        await installDependencies(folderPath);
        console.log("✅Dependencies installed");

        // Build project
        console.log("⚒️Building project...");
        await buildProject(folderPath);
        console.log("✅Project built");

        // Upload to S3
        console.log("🔼 Uploading to S3...");
        await uploadFinalDist(folderPath, element);
        console.log("✅Uploaded to S3");

        console.log("🚀 Project built and uploaded");
        publisher.hSet("status", element, "deployed");
      }
    }
  }
}

main();
