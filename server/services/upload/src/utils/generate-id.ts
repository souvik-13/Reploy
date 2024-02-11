import { v4 as uuidv4 } from "uuid";

/**
 * It generates a random id
 * If length is provided, it generates a random id of that length
 * If length is not provided, it generates a random uuid
 * @param length
 * @returns
 */
const generateId = (length?: number) => {
  if (length) {
    const smalls = "abcdefghijklmnopqrstuvwxyz";
    const nums = "0123456789";
    let id = "";
    for (let i = 0; i < length; i++) {
      const random = Math.random();
      if (random < 0.5) {
        id += smalls[Math.floor(Math.random() * smalls.length)];
      } else {
        id += nums[Math.floor(Math.random() * nums.length)];
      }
    }
    return id;
  } else {
    return uuidv4();
  }
};

export default generateId;
