import express from "express";
import userController from "../controllers/userController";

const router = express.Router();

// Add User Data
router.post("/add", userController.addUser);

// Update User Data
router.put("/update/:id", userController.updateUser);

// Delete User Data
router.delete("/delete/:id", userController.deleteUser);

// Get User By Id
router.post("/get/:id", userController.getUserById);

// Get All User Data
router.post("/getAll", userController.getAllUsers);


export default router;
