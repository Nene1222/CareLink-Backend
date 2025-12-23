import express from 'express';
import {
  getAllUsers,
  register,
  sendRegisterOTP,
  sendForgetPasswordOTP,
  changePassword,
  login,
  deleteAllUsers
} from '../controllers/authController';

const router = express.Router();

// GET routes
router.get('/get-all-users', getAllUsers);

// POST routes
router.post('/send-register-otp', sendRegisterOTP);
router.post('/send-forget-pass-otp', sendForgetPasswordOTP);

// PUT routes
router.put('/register', register);
router.put('/login', login);
router.put('/change-password', changePassword);

// DELETE routes
router.delete('/delete_all_users', deleteAllUsers);

export default router;
