import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";
import { createClient } from "redis";

import { deleteFile, getUploads, uploadFile } from "./db";
import generateId from "./utils/generate-id";
import getFilePaths from "./utils/get-file-paths";
import getFoldersInDir from "./utils/get-folders-in-dir";
import { cleanUp } from "./utils/cleanup";

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
let listUploads: string[] = [];

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
    console.log(
      `Error on upload
        repoURl: ${repoUrl}
        error: ${error}
      `,
    );
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

    // cleanup
    setTimeout(() => {
      console.log("🧹 Cleaning up");
      cleanUp(repoPath);
      console.log("✅ Cleaned up");
    }, 1000 * 60 * 60 * 24);

    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");

    res.json({ id });
  } catch (error) {
    console.log(
      `Error on upload
        repoURl: ${repoUrl}
        error: ${error}
      `,
    );
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
  // const pathTorepos = path.join(__dirname, "repos");
  try {
    const folders = await getUploads();
    listUploads = [];
    const ids: string[] = [];
    folders?.forEach((folder) => {
      listUploads.push(folder.Key as string);
      const id = folder.Key?.split("/")[1];
      if (!ids.includes(id as string)) {
        ids.push(id as string);
      }
    });
    res.json({ ids });
  } catch (error) {
    console.log(
      `Error on /ids
        error: ${error}
      `,
      res.status(500).json({ message: "error getting ids" }),
    );
  }
});

app.delete("/delete", async (req, res) => {
  const id: string = req.query.id as string;
  const currentUploads = listUploads;
  console.log("id", id);
  try {
    const toDelete = currentUploads.filter((fileName) => {
      return fileName.split("/").includes(id);
    });
    for (const fileName of toDelete) {
      await deleteFile(fileName);
    }
    publisher.hDel("status", id);
    console.log("deleted");
    res.json({ deletedFiles: toDelete });
  } catch (error) {
    console.log(
      `Error on /delete
        id: ${id}
        error: ${error}
      `,
    );
    res.json({ message: "error deleting repo" });
  }
});

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}
        POST    http://localhost:${PORT}/upload
        GET     http://localhost:${PORT}/status
        GET     http://localhost:${PORT}/ids?id
        DELETE  http://localhost:${PORT}/delete?id= 
    `,
  );
});
