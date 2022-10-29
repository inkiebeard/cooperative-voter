import logger from "./logger";

const secretGenerator = (length = 64) => {
  if (length < 16) {
    throw new Error('secrets must be at least 16 characters long');
  }
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charsLength = chars.length;
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return result;
}

export {
  secretGenerator,
  logger
}

export default {
  secretGenerator,
  logger
};