import { S3Client, PutObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import * as config from "./config";

const s3Client = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY,
  },
});

export const uploadFile = async (localFilePath: string, fileName: string) => {
  const fileContent = fs.readFileSync(localFilePath);
  const params = {
    Bucket: "souviksbasket1",
    Key: fileName,
    Body: fileContent,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
  } catch (error) {
    console.log("Error", error);
  }
};

export const getUploads = async () => {
  const params = {
    Bucket: "souviksbasket1",
    prefix: "dist"
  };
  try {
    const data = await s3Client.send(new ListObjectsCommand(params));
    return data.Contents;
  } catch (error) {
    console.log("Error", error);
  }
};
