import express from "express";
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  getDoctorByCode,
  updateDoctor,
  deleteDoctor,
} from "../controller/doctor.controller";

const router = express.Router();

// Create doctor
router.post("/", createDoctor);

// Read doctors
router.get("/", getAllDoctors);
router.get("/code/:code", getDoctorByCode);
router.get("/:id", getDoctorById);

// Update & delete
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;
