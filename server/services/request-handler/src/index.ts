import express from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import * as config from "./config";
import stream from "stream";

const app = express();
const s3 = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY,
  },
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

app.get("/*", async (req, res) => {
  const host = req.hostname; // eg: "user1.example.com" ; for vercel deployment, it will be "user1.vercel.app"
  const id = host.split(".")[0];
  //   console.log(id);
  const filePath = req.path === "/" ? "/index.html" : req.path;
  const key = `dist/${id}${filePath}`;
  try {
    const files = await s3.send(
      new GetObjectCommand({
        Bucket: "reploy",
        Key: key,
      }),
    );
    const ext = filePath.split(".").pop();
    let type: string;
    switch (ext) {
      case "html":
        type = "text/html";
        break;
      case "css":
        type = "text/css";
        break;
      case "js":
        type = "text/javascript";
        break;
      case "json":
        type = "application/json";
        break;
      case "png":
        type = "image/png";
        break;
      case "jpg":
        type = "image/jpg";
        break;
      case "jpeg":
        type = "image/jpeg";
        break;
      case "svg":
        type = "image/svg+xml";
        break;
      case "gif":
        type = "image/gif";
        break;
      case "ico":
        type = "image/x-icon";
        break;
      default:
        type = "text/plain";
    }
    res.set("Content-Type", type);
    // console.log(files);
    if (files.Body instanceof stream.Readable) {
      files.Body.pipe(res);
    } else {
      res.send(files.Body);
    }
  } catch (error) {
    // console.log(error);
    res.status(404).send("File not found");
  }
});
