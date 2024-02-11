import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";
import { createClient } from "redis";

import { uploadFile } from "./db";
import generateId from "./utils/generate-id";
import getFilePaths from "./utils/get-file-paths";
import getFoldersInDir from "./utils/get-folders-in-dir";

const app = express();
const git = simpleGit();
const PORT = process.env.PORT || 3000;
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
  // check if repoUrl is valid
  try {
    console.log(repoUrl);
    await git.listRemote(["--get-url", repoUrl]);
  } catch (error) {
    return res.status(400).json({ message: "Invalid repoUrl" });
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
  // console.log(req.host);
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }
  // console.log("id", id);
  const response = await subscriber.hGet("status", id as string);
  res.json({
    status: response,
  });
});

app.get("/ids", async (req, res) => {
  const pathTorepos = path.join(__dirname, "repos");
  const folders = await getFoldersInDir(pathTorepos);
  res.json({ folders });
});

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}
     POST http://localhost:${PORT}/upload
    `,
  );
});
