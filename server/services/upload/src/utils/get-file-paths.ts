import fs from "fs";
import path from "path";

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

export default getFilePaths;