import express from "express";
import userController from "../controllers/userController";
const upload = require("../services/fileupload")

const router = express.Router();

// Add User Data
router.post("/add", userController.addUser);

// Update User Data
router.put("/update/:id", userController.updateUser);

// Delete User Data
router.delete("/delete/:id", userController.deleteUser);

// Get User By Id
router.get("/get/:id", userController.getUserById);

// Get All User Data
router.get("/getAll", userController.getAllUsers);

// Update User Status
router.post("/updatestatus/:id", userController.updateUserStatus);

// Get User By Profile Id
router.get("/get/profile/:profileId", userController.getUserByProfileId);

// Get Unarchive Users
router.get("/unarchiveuser", userController.getUnarchiveUser);

// Add CSV Data
router.post("/upload-csv", upload.single("file"),userController.addCsvData)

// Ger CSV Data
router.get("/getcsvdata", userController.getCsvData)

export default router;
