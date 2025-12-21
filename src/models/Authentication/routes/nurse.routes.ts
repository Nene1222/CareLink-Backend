import express from "express";
import {
  createNurse,
  getAllNurses,
  getNurseById,
  updateNurse,
  deleteNurse,
} from "../controller/controllers/nurse.controller";

const router = express.Router();

// Create
router.post("/", createNurse);

// Read
router.get("/", getAllNurses);
router.get("/:id", getNurseById);

// Update & Delete
router.put("/:id", updateNurse);
router.delete("/:id", deleteNurse);

export default router;
