import express from "express";
import {
  createLabTechnician,
  getAllLabTechnicians,
  getLabTechnicianById,
  updateLabTechnician,
  deleteLabTechnician,
} from "../controller/controllers/labTechnician.controller";

const router = express.Router();

// Create
router.post("/", createLabTechnician);

// Read
router.get("/", getAllLabTechnicians);
router.get("/:id", getLabTechnicianById);

// Update & Delete
router.put("/:id", updateLabTechnician);
router.delete("/:id", deleteLabTechnician);

export default router;
