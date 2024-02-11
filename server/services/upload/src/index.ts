import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";
import { createClient } from "redis";

import { uploadFile } from "./db";
import generateId from "./utils/generate-id";
import getFilePaths from "./utils/get-file-paths";

const app = express();
const git = simpleGit();
const PORT = 3000;
const publisher = createClient();
const subscriber = createClient();
publisher.connect();
subscriber.connect();

app.use(cors());
app.use(express.json());

const repoFolderPath = path.join(__dirname, "repos");
let prevIds: string[] = [];


app.post("/upload", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  if (!repoUrl) {
    return res.status(400).json({ message: "repoUrl is required" });
  }
  let id: string;
  while (true) {
    id = generateId(5);
    if (!prevIds.includes(id)) {
      prevIds.push(id);
      break;
    }
  }
  const repoPath = path.join(repoFolderPath, id);
  try {
    await git.clone(repoUrl, repoPath);
    const filePaths = getFilePaths(repoPath);
    // console.log(filePaths);
    console.log("🔼 Uploading files");
    for (const filePath of filePaths) {
      const fileName = filePath.replace(repoFolderPath, "repos");
      // console.log(fileName);
      await uploadFile(filePath, fileName);
    }
    console.log("✅ Uploaded files");

    console.log("🚃 Added to build queue");
    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");

    res.json({ id });
  } catch (error) {
    res.status(500).json({ message: "Error cloning repository" });
  }
});

app.get("/status", async (req, res) => {
  const id = req.query.id;
  const response = await subscriber.hGet("status", id as string);
  res.json({
    status: response,
  });
});

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}
     POST http://localhost:${PORT}/upload
    `,
  );
});
