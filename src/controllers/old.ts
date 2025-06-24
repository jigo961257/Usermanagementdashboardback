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
// import { getDB, saveDB } from "../utils/dbUtils";
// import { successResponse, errorResponse } from "../utils/reponseHandler";
// import { roleTableMap } from "../config/constants";

// // Add User Data
// const addUser = async (req: any, res: any) => {
//   try {
//     const { roleName, ...userData } = req.body;
//     console.log("eorlenamemme", roleName);
//     console.log("userdatatata..", userData);
//     if (!roleName) return errorResponse(res, "Role Name is required", 400);

//     const db = getDB();
//     const tableName = roleTableMap[roleName];
//     if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

//     const users = db[tableName];
//     const isEmailExistsInDB = users.some(
//       (u: any) => u.email === userData.email
//     );
//     if (isEmailExistsInDB)
//       return errorResponse(res, "Email already exists in database", 400);

//     const role = db.roles.find((r: any) => r.name === roleName);
//     if (!role)
//       return errorResponse(res, "Role ID not found for the Role Name", 400);

//     const newUser = { id: users.length + 1, ...userData, roleId: role.id };
//     users.push(newUser);
//     saveDB(db);

//     return successResponse(res, `${roleName} added successfully`, newUser);
//   } catch (err) {
//     console.error(err);
//     return errorResponse(res, "Internal Server Error", 500);
//   }
// };

// // Update User Data
// const updateUser = async (req: any, res: any) => {
//   try {
//     const { roleName,email } = req?.body;
// console.log("roklenmmm",roleName)
//     const { id } = req.params;
//     const db = getDB();

//     const tableName = roleTableMap[roleName];
//     if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

//     const users = db[tableName];

//     const index = users.findIndex((u: any) => u.id == id);
//     if (index === -1) return errorResponse(res, "User not found", 404);

//     const isEmailExists = users.some((u: any) => u.email === email && u.id != id);
//     if (isEmailExists) return errorResponse(res, "Email already exists for another user", 400);

//     const role = db.roles.find((r: any) => r.name === roleName);
//     if (!role)
//       return errorResponse(res, "Role ID not found for the Role Name", 400);

//     users[index] = {
//       ...users[index],
//       ...req.body,
//       roleId: role.id,
//     };
//     saveDB(db);

//     return successResponse(res, "User updated successfully", users[index]);
//   } catch (err) {
//     console.error(err);
//     return errorResponse(res, "Internal Server Error", 500);
//   }
// };

// // Delete User Data
// const deleteUser = async (req: any, res: any) => {
//   try {
//     const { roleName } = req?.body;
//     const { id } = req.params;
//     const db = getDB();
//     const tableName = roleTableMap[roleName];
//     if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

//     const users = db[tableName];
//     const index = users.findIndex((u: any) => u.id == id);
//     if (index === -1) return errorResponse(res, "User not found", 404);

//     const deleted = users.splice(index, 1);
//     saveDB(db);

//     return successResponse(res, "User deleted successfully", deleted[0]);
//   } catch (err) {
//     console.error(err);
//     return errorResponse(res, "Internal Server Error", 500);
//   }
// };

// // Get User By Id
// const getUserById = async (req: any, res: any) => {
//   try {
//     const { roleName } = req?.body;

//     const { id } = req.params;

//     const db = getDB();
//     const tableName = roleTableMap[roleName];
//     if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

//     const users = db[tableName];
//     const user = users.find((u: any) => u.id == id);

//     if (!user) return errorResponse(res, "User not found", 404);

//     return successResponse(res, "User fetched successfully", user);
//   } catch (err) {
//     console.error(err);
//     return errorResponse(res, "Internal Server Error", 500);
//   }
// };

// // Get All User Data
// const getAllUsers = async (req: any, res: any) => {
//   try {
//     const { roleName } = req.body;
//     const db = getDB();
//     const tableName = roleTableMap[roleName];
//     if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

//     const users = db[tableName];
//     return successResponse(res, "Users fetched successfully", users);
//   } catch (err) {
//     console.error(err);
//     return errorResponse(res, "Internal Server Error", 500);
//   }
// };

// export default { addUser, updateUser, deleteUser, getUserById, getAllUsers };
// import { getDB, saveDB } from "../utils/dbUtils";
// import { successResponse, errorResponse } from "../utils/reponseHandler";
// import { roleTableMap } from "../config/constants";

// // Add User Data
// const addUser = async (req: any, res: any) => {
//   try {
//     const { roleName, ...userData } = req.body;
//     console.log("eorlenamemme", roleName);
//     console.log("userdatatata..", userData);
//     if (!roleName) return errorResponse(res, "Role Name is required", 400);

//     const db = getDB();
//     const tableName = roleTableMap[roleName];
//     if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

//     const users = db[tableName];
//     const isEmailExistsInDB = users.some(
//       (u: any) => u.email === userData.email
//     );
//     if (isEmailExistsInDB)
//       return errorResponse(res, "Email already exists in database", 400);

//     const role = db.roles.find((r: any) => r.name === roleName);
//     if (!role)
//       return errorResponse(res, "Role ID not found for the Role Name", 400);

//     const newUser = { id: users.length + 1, ...userData, roleId: role.id };
//     users.push(newUser);
//     saveDB(db);

//     return successResponse(res, `${roleName} added successfully`, newUser);
//   } catch (err) {
//     console.error(err);
//     return errorResponse(res, "Internal Server Error", 500);
//   }
// };

// // Update User Data
// const updateUser = async (req: any, res: any) => {
//   try {
//     const { roleName,email } = req?.body;
// console.log("roklenmmm",roleName)
//     const { id } = req.params;
//     const db = getDB();

//     const tableName = roleTableMap[roleName];
//     if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

//     const users = db[tableName];

//     const index = users.findIndex((u: any) => u.id == id);
//     if (index === -1) return errorResponse(res, "User not found", 404);

//     const isEmailExists = users.some((u: any) => u.email === email && u.id != id);
//     if (isEmailExists) return errorResponse(res, "Email already exists for another user", 400);

//     const role = db.roles.find((r: any) => r.name === roleName);
//     if (!role)
//       return errorResponse(res, "Role ID not found for the Role Name", 400);

//     users[index] = {
//       ...users[index],
//       ...req.body,
//       roleId: role.id,
//     };
//     saveDB(db);

//     return successResponse(res, "User updated successfully", users[index]);
//   } catch (err) {
//     console.error(err);
//     return errorResponse(res, "Internal Server Error", 500);
//   }
// };

// // Delete User Data
// const deleteUser = async (req: any, res: any) => {
//   try {
//     const { roleName } = req?.body;
//     const { id } = req.params;
//     const db = getDB();
//     const tableName = roleTableMap[roleName];
//     if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

//     const users = db[tableName];
//     const index = users.findIndex((u: any) => u.id == id);
//     if (index === -1) return errorResponse(res, "User not found", 404);

//     const deleted = users.splice(index, 1);
//     saveDB(db);

//     return successResponse(res, "User deleted successfully", deleted[0]);
//   } catch (err) {
//     console.error(err);
//     return errorResponse(res, "Internal Server Error", 500);
//   }
// };

// // Get User By Id
// const getUserById = async (req: any, res: any) => {
//   try {
//     const { roleName } = req?.body;

//     const { id } = req.params;

//     const db = getDB();
//     const tableName = roleTableMap[roleName];
//     if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

//     const users = db[tableName];
//     const user = users.find((u: any) => u.id == id);

//     if (!user) return errorResponse(res, "User not found", 404);

//     return successResponse(res, "User fetched successfully", user);
//   } catch (err) {
//     console.error(err);
//     return errorResponse(res, "Internal Server Error", 500);
//   }
// };

// // Get All User Data
// const getAllUsers = async (req: any, res: any) => {
//   try {
//     const { roleName } = req.body;
//     const db = getDB();
//     const tableName = roleTableMap[roleName];
//     if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

//     const users = db[tableName];
//     return successResponse(res, "Users fetched successfully", users);
//   } catch (err) {
//     console.error(err);
//     return errorResponse(res, "Internal Server Error", 500);
//   }
// };

// export default { addUser, updateUser, deleteUser, getUserById, getAllUsers };
// import { supabase } from "../config/supabaseClient";
