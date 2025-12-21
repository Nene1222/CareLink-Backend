import express from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
  getRoleByName,
  updateRole,
  updateRoleUserCount,
  deleteRole,
} from "../controller/controllers/role.controller";

const router = express.Router();

// Create
router.post("/", createRole);

// Read
router.get("/", getAllRoles);
router.get("/name/:name", getRoleByName);
router.get("/:id", getRoleById);

// Update
router.put("/:id", updateRole);
router.put("/update-user-count/:name", updateRoleUserCount);

// Delete
router.delete("/:id", deleteRole);

export default router;
