import jwt from "jsonwebtoken";
import { getDB, saveDB, generateOtp } from "../utils/dbUtils";
import { emailSender } from "../services/email.helper";
import { EMAILCONSTANT, roleTableMap } from "../config/constants";
import { successResponse, errorResponse } from "../utils/reponseHandler";

interface User {
  email: string;
  password: string;
  roleName: string;
}

// User Login Api
const Userlogin = async (req: any, res: any) => {
  try {
    const { email, password, roleName } = req.body as any;
console.log("requuu",req?.body)
    if (!email || !password || !roleName)
      return errorResponse(res, "Email, Password, and Role are required", 400);

    const db = getDB();
    const tableName = roleTableMap[roleName];

    if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

    const users = db[tableName];
    const user = users.find((u: any) => u.email === email);

    if (!user) return errorResponse(res, "User not found", 404);

    if (user.password !== password)
      return errorResponse(res, "Incorrect Password", 400);

    const payload = { id: user.id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    const data = {
      user_id: user.id,
      email: user.email,
      token: accessToken,
      refreshToken,
      roleName,
    };

    return successResponse(res, "Login Successful", data);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

// Send Otp Api
const sendOTP = async (req: any, res: any) => {
  try {
    const { email, roleName } = req.body;

    if (!email || !roleName)
      return errorResponse(res, "Email and Role are required.", 400);

    const db = getDB();
    const tableName = roleTableMap[roleName];
    if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

    const users = db[tableName];
    const user = users.find((u: any) => u.email === email);

    if (!user) return errorResponse(res, "User not found.", 404);

    const OTP = generateOtp(4);
    user.otp = "1234";
    saveDB(db);

    const templateData = { email, OTP };

    await emailSender(
      email,
      EMAILCONSTANT.SEND_OTP.subject,
      templateData,
      EMAILCONSTANT.SEND_OTP.template
    );

    return successResponse(res, "OTP sent successfully.");
  } catch (error) {
    console.error("Error sending OTP:", error);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

// Verify User Otp
const verifyOtp = (req: any, res: any) => {
  try {
    const { email, otp, roleName } = req.body;

    if (!email || !otp || !roleName)
      return errorResponse(res, "Email, OTP, and Role are required.", 400);

    const db = getDB();
    const tableName = roleTableMap[roleName];
    if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

    const users = db[tableName];
    const user = users.find((u: any) => u.email === email);

    if (!user) return errorResponse(res, "User not found", 404);
    if (user.otp !== otp) return errorResponse(res, "Invalid OTP", 400);

    user.otp = null;
    saveDB(db);

    const payload = { id: user.id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    const data = {
      user_id: user.id,
      email: user.email,
      token: accessToken,
      refreshToken,
      roleName,
    };

    return successResponse(res, "OTP verified successfully.", data);
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

export default { Userlogin, sendOTP, verifyOtp };
