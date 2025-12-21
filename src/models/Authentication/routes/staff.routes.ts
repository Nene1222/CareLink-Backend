import express from "express";
import {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
} from "../controller/controllers/staff.controller";

const router = express.Router();

// Create
router.post("/", createStaff);

// Read
router.get("/", getAllStaff);
router.get("/:id", getStaffById);

// Update & Delete
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

export default router;
