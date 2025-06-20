import fs from "fs";
import path from "path";
const dbPath = path.join(__dirname, "../config/db.json");

export const getDB = () => {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
};

export const saveDB = (db: any) => {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
};

export const generateOtp = (length: number = 4): string => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

export const readHTMLFile = function (path: any, cb: any) {
  // read file
  fs.readFile(path, "utf-8", function (err, data) {
    if (err) {
      console.log(err);
      throw err;
    } else {
      cb(null, data);
    }
  });
};
