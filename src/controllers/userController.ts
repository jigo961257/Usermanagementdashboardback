import { supabase } from "../supabseClient";
import bcrypt from "bcrypt";
import { successResponse, errorResponse } from "../utils/reponseHandler";
import { roleTableMap } from "../config/constants";
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

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
    const { id } = req.params;
    const { email, first_name, last_name } = req.body;

    if (!id) return errorResponse(res, "User ID is required", 400);
    if (!email || !first_name || !last_name) {
      return errorResponse(res, "First name, last name, and email are required", 400);
    }

    const { data: userExists, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (!userExists) {
      return errorResponse(res, "User not found", 404);
    }

    const { data: existing, error: existingError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .neq("id", id)
      .maybeSingle();

    if (existing && existing.id) {
      return errorResponse(res, "Email already exists for another user", 400);
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ first_name, last_name, email })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error(updateError);
      return errorResponse(res, "Failed to update user", 500);
    }

    return successResponse(res, "User updated successfully", updatedUser);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

// Delete User Data
const deleteUser = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    if (!id) return errorResponse(res, "User ID is required", 400);

    const { data: existingUser, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (!existingUser) {
      return errorResponse(res, "User not found", 404);
    }

    const { data: deletedUser, error } = await supabase
      .from("users")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(error);
      return errorResponse(res, "Error deleting user", 500);
    }

    return successResponse(res, "User deleted successfully", deletedUser);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

// Get User By Id
const getUserById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    if (!id) return errorResponse(res, "User ID is required", 400);

    const { data: existingUser, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", id)
      .maybeSingle();


    if (!existingUser) {
      return errorResponse(res, "User not found", 404);
    }

    const { data, error } = await supabase
      .from("users")
      .select(`
        id, first_name, last_name, email, status, role_id,profile_id,
        roles ( name )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return errorResponse(res, "Failed to fetch user", 500);
    }

    return successResponse(res, "User fetched successfully", data);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

// Get All User Data
const getAllUsers = async (req: any, res: any) => {
  try {
    const { data, error } = await supabase.from("users").select(`
      id, first_name, last_name, email, status, role_id,profile_id,
      roles ( name )
    `).eq("status", "Active");


    if (error) {
      console.error(error);
      return errorResponse(res, "Error fetching users", 500);
    }

    return successResponse(res, "Users fetched successfully", data);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

// Update User Status
const updateUserStatus = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) return errorResponse(res, "User ID is required", 400);
    
    if (!status || !["Active", "Inactive"].includes(status))
      return errorResponse(res, "Valid status is required: 'Active' or 'Inactive'", 400);

    const { data: existingUser, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (!existingUser) return errorResponse(res, "User not found", 404);

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error(updateError);
      return errorResponse(res, "Failed to update user status", 500);
    }

    return successResponse(res, "User status updated successfully", updatedUser);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

// Get User By Profile Id
const getUserByProfileId = async (req: any, res: any) => {
  try {
    const { profileId } = req.params;

    if (!profileId) return errorResponse(res, "Profile ID is required", 400);

    const { data, error } = await supabase
      .from("users")
      .select(`
        id, first_name, last_name, email, status, role_id, profile_id,
        roles ( name )
      `)
      .eq("profile_id", profileId)
      .maybeSingle();


    if (!data) return errorResponse(res, "User not found", 404);

    return successResponse(res, "User fetched successfully", data);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

// Get Unarchive Users
const getUnarchiveUser = async (req: any, res: any) => {
  try {
    const { data, error } = await supabase.from("users").select(`
      id, first_name, last_name, email, status, role_id,
      roles ( name )
    `).eq("status", "Inactive");


    if (error) {
      console.error(error);
      return errorResponse(res, "Error fetching users", 500);
    }

    return successResponse(res, "Users fetched successfully", data);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

// Add User CSV Data
const addCsvData = async (req: any, res: any) => {
  try {
    const file = req.file;
    console.log("filelle",file)
    if (!file) return res.status(400).json({ message: 'CSV file is required' });

    const results: any[] = [];
    const filePath = path.join(__dirname, '../uploads', file.filename);

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        console.log("datata",data)
        results.push({
          first_name: data.first_name,
          last_name: data.last_name,
        });
      })
      .on('end', async () => {
        const { error } = await supabase.from('bulkusers').insert(results);
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Failed to insert data', error });
        }
        res.status(200).json({ message: 'CSV data inserted successfully' });
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get All User CSV Data
const getCsvData = async (req: any, res: any) => {
  try {
    const { data, error } = await supabase.from("bulkusers").select(`
      id, first_name, last_name
    `);


    if (error) {
      console.error(error);
      return errorResponse(res, "Error fetching users", 500);
    }

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
  updateUserStatus,
  getUserByProfileId,
  getUnarchiveUser,
  addCsvData,
  getCsvData
};
