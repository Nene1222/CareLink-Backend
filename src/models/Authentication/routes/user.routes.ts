import express from "express";
import {
  registerUser,
  loginUser,
  generateOTP,
  verifyOTP,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controller/controllers/user.controller";

const router = express.Router();

// Auth & OTP
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/otp/generate", generateOTP);
router.post("/otp/verify", verifyOTP);

// CRUD
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
