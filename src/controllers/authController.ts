import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../utils/reponseHandler";
import bcrypt from "bcrypt";
import { supabase } from "../supabseClient";
import { v4 as uuidv4 } from "uuid";
interface User {
  email: string;
  password: string;
  roleName: string;
}

//Register User
const registerUser = async (req: any, res: any) => {
  try {
    const { first_name, last_name, email, password, confirmPassword } =
      req.body;

    if (!first_name || !last_name || !email || !password || !confirmPassword) {
      return errorResponse(res, "All fields are required", 400);
    }

    if (password !== confirmPassword) {
      return errorResponse(
        res,
        "Password and Confirm Password do not match",
        400
      );
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

    //For Registration Using Authentication:-
    // const { data, error } = await supabase.auth.signUp({
    //   email: email,
    //   password: hashedPassword,
    // });
    //For Sign in with authentication
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email: "test@example.com",
    //   password: "your_password"
    // });
    const firstPart = first_name.trim().toLowerCase().slice(0, 3);
    const lastPart = last_name.trim().toLowerCase().slice(0, 3);
    const uniqueSuffix = uuidv4().slice(0, 6); // 6-char random string
    const profile_id = `${firstPart}_${lastPart}_${uniqueSuffix}`;

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          first_name,
          last_name,
          email,
          password: hashedPassword,
          profile_id,
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

// User Login Api
const Userlogin = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and Password are required", 400);
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, password, first_name, last_name, role_id")
      .eq("email", email)
      .maybeSingle();

    if (userError || !user) {
      return errorResponse(res, "User not found", 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, "Incorrect Password", 400);
    }

    const { data: role, error: roleError } = await supabase
      .from("roles")
      .select("id, name")
      .eq("id", user.role_id)
      .maybeSingle();

    const payload = {
      id: user.id,
      email: user.email,
      roleName: role?.name || null,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    const responseData = {
      user_id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role_id: user.role_id,
      role_name: role?.name || null,
      token: accessToken,
      refreshToken,
    };

    return successResponse(res, "Login Successful", responseData);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

// Send Otp Api
const sendOTP = async (req: any, res: any) => {
  try {
    const { email } = req.body;

    if (!email) return errorResponse(res, "Email is required.", 400);

    const { data: user, error } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();

    if (error || !user) return errorResponse(res, "User not found.", 404);

    const OTP = "1234";

    const { error: updateError } = await supabase
      .from("users")
      .update({ otp: OTP })
      .eq("id", user.id);

    if (updateError) {
      console.error(updateError);
      return errorResponse(res, "Failed to save OTP", 500);
    }

    return successResponse(res, "OTP sent successfully.");
  } catch (error) {
    console.error("Error sending OTP:", error);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

// Verify User Otp
const verifyOtp = async (req: any, res: any) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return errorResponse(res, "Email and OTP are required.", 400);

    const { data: user, error } = await supabase
      .from("users")
      .select(
        `
        id, email, otp, role_id,
        roles ( name )
      `
      )
      .eq("email", email)
      .maybeSingle();

    if (error || !user) return errorResponse(res, "User not found", 404);
    if (user.otp !== otp) return errorResponse(res, "Invalid OTP", 400);

    const { error: clearOtpError } = await supabase
      .from("users")
      .update({ otp: null })
      .eq("id", user.id);

    if (clearOtpError) {
      console.error(clearOtpError);
      return errorResponse(res, "Failed to clear OTP", 500);
    }
    const { data: role, error: roleError } = await supabase
      .from("roles")
      .select("id, name")
      .eq("id", user.role_id)
      .maybeSingle();

    const payload = {
      id: user.id,
      email: user.email,
      roleName: role?.name || null,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    const data = {
      user_id: user.id,
      email: user.email,
      roleName: role?.name || null,
      token: accessToken,
      refreshToken,
    };

    return successResponse(res, "OTP verified successfully.", data);
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

export default { registerUser, Userlogin, sendOTP, verifyOtp };
