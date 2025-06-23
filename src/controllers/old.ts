// const Userlogin = async (req: Request, res: any) => {
//   try {
//     const { email, password } = req.body as any;
//     if (!email || !password)
//       return errorResponse(res, "Email and Password required", 400);

//     const db = getDB();
//     const user = db.users.find((u: any) => u.email === email);

//     if (!user) return errorResponse(res, "User not found", 404);

//     const isMatch = password == user.password ? true : false;
//     if (!isMatch) return errorResponse(res, "Incorrect Password", 400);

//     const payload = { id: user.id, email: user.email };
//     const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
//       expiresIn: "1h",
//     });
//     const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
//       expiresIn: "7d",
//     });
//     const data = {
//       user_id: user.id,
//       email: user.email,
//       token: accessToken,
//       refreshToken,
//       roleName: "Admin",
//     };

//     return successResponse(res, "Login Successful", data);
//   } catch (err) {
//     console.error(err);
//     return errorResponse(res, "Internal Server Error", 500);
//   }
// };
// Resend Otp Api

// const sendOTP = async (req: any, res: any) => {
//   try {
//     const { email } = req.body;

//     if (!email) return errorResponse(res, "Email is required.", 400);

//     const db = getDB();
//     const user = db.users.find((u: any) => u.email === email);

//     if (!user) return errorResponse(res, "User not found.", 404);

//     const OTP = generateOtp(4);
//     user.otp = "1234";
//     saveDB(db);

//     const templateData = { email, OTP };

//     await emailSender(
//       email,
//       EMAILCONSTANT.SEND_OTP.subject,
//       templateData,
//       EMAILCONSTANT.SEND_OTP.template
//     );

//     return successResponse(res, "OTP sent successfully");
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     return errorResponse(res, "Internal Server Error", 500);
//   }
// };

// // Verify User Otp
// const verifyOtp = (req: any, res: any) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) return errorResponse(res, "Email & OTP required", 400);

//     const db = getDB();
//     const user = db.users.find((u: any) => u.email === email);

//     if (!user) return errorResponse(res, "User not found", 404);
//     if (user.otp !== otp) return errorResponse(res, "Invalid OTP", 400);

//     user.otp = null;
//     saveDB(db);

//     return successResponse(res, "OTP verified successfully");
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     return errorResponse(res, "Internal Server Error", 500);
//   }
// };
