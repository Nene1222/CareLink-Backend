import express from "express";
import {
  createPatient,
  getAllPatients,
  getPatientById,
  getPatientByCode,
  updatePatient,
  deletePatient,
} from "../controller/patient.controller";

const router = express.Router();

// Create
router.post("/", createPatient);

// Read
router.get("/", getAllPatients);
router.get("/code/:code", getPatientByCode);
router.get("/:id", getPatientById);

// Update & Delete
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
