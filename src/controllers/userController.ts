import { supabase } from "../supabseClient";
import bcrypt from "bcrypt";
import { successResponse, errorResponse } from "../utils/reponseHandler";
import { roleTableMap } from "../config/constants";

// Add User Data
const addUser = async (req: any, res: any) => {
  try {
    const { roleName, password, confirmPassword, ...userData } = req.body;
    if (!roleName || !password)
      return errorResponse(res, "Role Name and Password are required", 400);

    if (password !== confirmPassword) {
      return errorResponse(
        res,
        "Password and Confirm Password do not match",
        400
      );
    }

    const tableName = roleTableMap[roleName];
    if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

    // Check for duplicate email
    const { data: existingUser, error: findError } = await supabase
      .from(tableName)
      .select("id")
      .eq("email", userData.email)
      .single();

    if (findError && findError.code !== "PGRST116") {
      console.error(findError);
      return errorResponse(res, "Error checking email", 500);
    }
    if (existingUser) return errorResponse(res, "Email already exists", 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: role, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", roleName)
      .single();

    if (roleError || !role) {
      console.error(roleError);
      return errorResponse(
        res,
        "Role ID not found for provided Role Name",
        400
      );
    }

    const role_id = role.id;

    const { data, error } = await supabase
      .from(tableName)
      .insert([{ ...userData, password: hashedPassword, role_id }])
      .select()
      .single();

    if (error) return errorResponse(res, "Error adding user", 500);
    return successResponse(res, `${roleName} added successfully`, data);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

// Update User Data
const updateUser = async (req: any, res: any) => {
  try {
    const { roleName, email, ...updateFields } = req.body;
    const { id } = req.params;

    const tableName = roleTableMap[roleName];
    if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

    const { data: existing, error: existingError } = await supabase
      .from(tableName)
      .select("id")
      .eq("email", email)
      .neq("id", id)
      .single();

    if (existing && existing.id)
      return errorResponse(res, "Email already exists for another user", 400);
    const { data: role, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", roleName)
      .single();

    if (roleError || !role) {
      console.error(roleError);
      return errorResponse(
        res,
        "Role ID not found for provided Role Name",
        400
      );
    }

    const role_id = role.id;

    let updatedData = { ...updateFields, email, role_id };
    // if (password) {
    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   updatedData.password = hashedPassword;
    // }

    const { data, error } = await supabase
      .from(tableName)
      .update(updatedData)
      .eq("id", id)
      .select()
      .single();

    if (error) return errorResponse(res, "Error updating user", 500);
    return successResponse(res, "User updated successfully", data);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

// Delete User Data
const deleteUser = async (req: any, res: any) => {
  try {
    const { roleName } = req.body;
    const { id } = req.params;

    const tableName = roleTableMap[roleName];
    if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) return errorResponse(res, "Error deleting user", 500);
    return successResponse(res, "User deleted successfully", data);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

// Get User By Id
const getUserById = async (req: any, res: any) => {
  try {
    const { roleName } = req.body;
    const { id } = req.params;

    const tableName = roleTableMap[roleName];
    if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) return errorResponse(res, "User not found", 404);
    return successResponse(res, "User fetched successfully", data);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

// Get All User Data
const getAllUsers = async (req: any, res: any) => {
  try {
    const { roleName } = req.body;

    const tableName = roleTableMap[roleName];
    if (!tableName) return errorResponse(res, "Invalid Role Name", 400);

    const { data, error } = await supabase.from(tableName).select("*");

    if (error) return errorResponse(res, "Error fetching users", 500);
    return successResponse(res, "Users fetched successfully", data);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

export default {
  addUser,
  updateUser,
  deleteUser,
  getUserById,
  getAllUsers,
};
