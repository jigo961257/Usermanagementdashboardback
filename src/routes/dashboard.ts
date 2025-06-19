import express from "express";
import dashboardController from "../controllers/dashboardController";

const router = express.Router();

// Get All Dashboard Data
router.get("/getall", dashboardController.getAll);


export default router;
