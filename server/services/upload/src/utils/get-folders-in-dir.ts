import fs from "fs";
import path from "path";

export const getFoldersInDir = async (dir: string) => {
  /* 
 we need to return the folders in this directory
 for example, if the directory has the following structure:
    dir
    ├── folder1
    ├── folder2
    └── folder3
    then
    getFoldersInDir(dir) should return ["folder1", "folder2"]
    we dont need to return "folder3" because it is not in the root of the directory
*/
  const folders = fs.readdirSync(dir).filter((file) => {
    return fs.statSync(path.join(dir, file)).isDirectory();
  });
  return folders;
};
export default getFoldersInDir;
