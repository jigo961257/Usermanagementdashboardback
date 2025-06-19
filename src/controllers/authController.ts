import jwt from "jsonwebtoken";
import { getDB, saveDB, generateOtp } from "../utils/dbUtils";
import { emailSender } from "../middleware/email.helper";
import { EMAILCONSTANT } from "../config/constants";

// User Login Api
const Userlogin = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and Password required" });

    const db = getDB();
    const user = db.users.find((u: any) => u.email === email);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = password == user.password ? true : false;
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect Password" });

    const payload = { id: user.id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    res.json({
      status: true,
      message: "Login Successful",
      data: {
        user_id: user.id,
        email: user.email,
        token: accessToken,
        refreshToken,
        roleName: "User",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Resend Otp Api
const sendOTP = async(req: any, res: any) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const db = getDB();
  const user = db.users.find((u: any) => u.email === email);

  if (!user) return res.status(404).json({ message: "User not found" });

  const OTP = generateOtp(6);
  user.otp = OTP;

  saveDB(db);
    const templateData = { email, OTP };

    await emailSender(
      email,
      EMAILCONSTANT.RESEND_OTP.subject,
      templateData,
      EMAILCONSTANT.RESEND_OTP.template
    );

  res.json({
    status: true,
    message: "OTP sent successfully",
    otp: OTP,
  });
};

// Verify User Otp
const verifyOtp = (req: any, res: any) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ message: "Email & OTP required" });

  const db = getDB();
  const user = db.users.find((u: any) => u.email === email);

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

  user.otp = null;
  saveDB(db);

  res.json({
    status: true,
    message: "OTP verified successfully",
  });
};

export default { Userlogin, sendOTP, verifyOtp };
