import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../utils/reponseHandler";
import bcrypt from "bcrypt";
import { supabase } from "../supabseClient";
interface User {
  email: string;
  password: string;
  roleName: string;
}

//Register User
const registerUser = async (req: any, res: any) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      confirmPassword,
    } = req.body;

    if (!first_name || !last_name || !email || !password || !confirmPassword) {
      return errorResponse(res, "All fields are required", 400);
    }

    if (password !== confirmPassword) {
      return errorResponse(res, "Password and Confirm Password do not match", 400);
    }

    const { data: existingUser, error: emailError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (emailError) {
      console.error(emailError);
      return errorResponse(res, "Error checking email existence", 500);
    }

    if (existingUser) {
      return errorResponse(res, "Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          first_name,
          last_name,
          email,
          password: hashedPassword,
        //   status: "active", // Optional, handled by default too
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error(insertError);
      return errorResponse(res, "Failed to register user", 500);
    }

    return successResponse(res, "User registered successfully", newUser);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

// // User Login Api
// const Userlogin = async (req: any, res: any) => {
//   try {
//     const { email, password, roleName } = req.body;

//     if (!email || !password || !roleName)
//       return errorResponse(res, "Email, Password, and Role are required", 400);

//     const tableName = roleTableMap[roleName];
//     if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

//     const { data: user, error } = await supabase
//       .from(tableName)
//       .select("id, email, password, first_name, last_name, role_id")
//       .eq("email", email)
//       .single();

//     if (error || !user) return errorResponse(res, "User not found", 404);

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) return errorResponse(res, "Incorrect Password", 400);

//     const payload = { id: user.id, email: user.email, roleName };
//     const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
//       expiresIn: "1h",
//     });
//     const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
//       expiresIn: "7d",
//     });

//     const data = {
//       user_id: user.id,
//       email: user.email,
//       first_name: user.first_name,
//       last_name: user.last_name,
//       role_id: user.role_id,
//       roleName,
//       token: accessToken,
//       refreshToken,
//     };

//     return successResponse(res, "Login Successful", data);
//   } catch (err) {
//     console.error(err);
//     return errorResponse(res, "Internal Server Error", 500);
//   }
// };

// // Send Otp Api
// const sendOTP = async (req: any, res: any) => {
//   try {
//     const { email, roleName } = req.body;

//     if (!email || !roleName)
//       return errorResponse(res, "Email and Role are required.", 400);

//     const tableName = roleTableMap[roleName];
//     if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

//     const { data: user, error } = await supabase
//       .from(tableName)
//       .select("id, email")
//       .eq("email", email)
//       .single();

//     if (error || !user) return errorResponse(res, "User not found.", 404);

//     // const OTP = generateOtp(4);
//     const OTP="1234"

//     // 👇 Store OTP temporarily in the user's record
//     const { error: updateError } = await supabase
//       .from(tableName)
//       .update({ otp: OTP })
//       .eq("id", user.id);

//     if (updateError) {
//       console.error(updateError);
//       return errorResponse(res, "Failed to save OTP", 500);
//     }

//     // const templateData = { email, OTP };

//     // await emailSender(
//     //   email,
//     //   EMAILCONSTANT.SEND_OTP.subject,
//     //   templateData,
//     //   EMAILCONSTANT.SEND_OTP.template
//     // );

//     return successResponse(res, "OTP sent successfully.");
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     return errorResponse(res, "Internal Server Error", 500);
//   }
// };

// // Verify User Otp
// const verifyOtp = async (req: any, res: any) => {
//   try {
//     const { email, otp, roleName } = req.body;

//     if (!email || !otp || !roleName)
//       return errorResponse(res, "Email, OTP, and Role are required.", 400);

//     const tableName = roleTableMap[roleName];
//     if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

//     const { data: user, error } = await supabase
//       .from(tableName)
//       .select("id, email, otp")
//       .eq("email", email)
//       .single();

//     if (error || !user) return errorResponse(res, "User not found", 404);
//     if (user.otp !== otp) return errorResponse(res, "Invalid OTP", 400);

//     const { error: clearOtpError } = await supabase
//       .from(tableName)
//       .update({ otp: null })
//       .eq("id", user.id);

//     if (clearOtpError) {
//       console.error(clearOtpError);
//       return errorResponse(res, "Failed to clear OTP after verification", 500);
//     }

//     const payload = { id: user.id, email: user.email, roleName };
//     const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
//       expiresIn: "1h",
//     });
//     const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
//       expiresIn: "7d",
//     });

//     const data = {
//       user_id: user.id,
//       email: user.email,
//       roleName,
//       token: accessToken,
//       refreshToken,
//     };

//     return successResponse(res, "OTP verified successfully.", data);
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     return errorResponse(res, "Internal Server Error", 500);
//   }
// };


export default {  registerUser };
