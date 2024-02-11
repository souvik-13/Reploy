import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

import { AWS_SECRET_KEY, AWS_ACCESS_KEY, AWS_REGION } from "./config";
import stream from "stream";

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

const downloadS3Folder = async (
  bucket: string,
  prefix: string,
  localFolderPath: string,
) => {
  const files = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    }),
  );
  // console.log(files);
  const allPromises =
    files.Contents?.map(async ({ Key }) => {
      return new Promise((resolve, reject) => {
        if (!Key) {
          resolve("");
          return;
        }
        const finalOutputPath = path.join(__dirname, Key);
        const dirName = path.dirname(finalOutputPath);
        if (!fs.existsSync(dirName)) {
          fs.mkdirSync(dirName, { recursive: true });
        }
        const outputFile = fs.createWriteStream(finalOutputPath);

        s3Client
          .send(
            new GetObjectCommand({
              Bucket: bucket,
              Key,
            }),
          )
          .then((data) => {
            if (data.Body instanceof Buffer) {
              // console.log("Buffer");
              outputFile.write(data.Body);
              outputFile.end();
              resolve(finalOutputPath);
            } else if (data.Body instanceof stream.Readable) {
              // console.log("Stream");
              data.Body.pipe(outputFile).on("finish", () => {
                resolve(finalOutputPath);
              });
            }
          });
      });
    }) || [];
  await Promise.all(allPromises?.filter((x) => x !== undefined));
};

const uploadFile = async (localFilePath: string, fileName: string) => {
  const fileContent = fs.readFileSync(localFilePath);
  const params = {
    Bucket: "souviksbasket1",
    Key: fileName,
    Body: fileContent,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    // console.log(response.$metadata.httpStatusCode);
  } catch (error) {
    console.log("Error", error);
  }
};

const getFilePaths = (folderPath: string) => {
  let paths: string[] = [];
  const files = fs.readdirSync(folderPath);
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      paths = paths.concat(getFilePaths(filePath));
    } else {
      paths.push(filePath);
    }
  });
  return paths;
};

const uploadFinalDist = async (folderPath: string, element: string) => {
  const distFolderPath = path.join(folderPath, "dist");
  const filePaths = getFilePaths(distFolderPath);
  const allPromises = filePaths.map((filePath) => {
    const fileName = `dist/${element}/${path.relative(
      distFolderPath,
      filePath,
    )}`;
    return uploadFile(filePath, fileName);
  });
  await Promise.all(allPromises);
};

export { downloadS3Folder, uploadFinalDist };

// downloadS3Folder("reploy", "repos/cgJkQ/");
