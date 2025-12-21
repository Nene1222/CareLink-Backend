import express from "express";
import {
  createPharmacist,
  getAllPharmacists,
  getPharmacistById,
  updatePharmacist,
  deletePharmacist,
} from "../controller/controllers/pharmacist.controller";

const router = express.Router();

// Create
router.post("/", createPharmacist);

// Read
router.get("/", getAllPharmacists);
router.get("/:id", getPharmacistById);

// Update & Delete
router.put("/:id", updatePharmacist);
router.delete("/:id", deletePharmacist);

export default router;
