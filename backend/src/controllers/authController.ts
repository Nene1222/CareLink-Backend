import User from '../models/User';
import OTP from '../models/OTP';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import { Request, Response } from 'express';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await User.find();
    res.status(200).json({
      result,
      message: 'All users retrieved successfully',
      success: true
    });
  } catch (error) {
    res.status(404).json({
      message: 'Error in getAllUsers - authController.ts',
      error,
      success: false
    });
  }
};

export const sendRegisterOTP = async (req: Request, res: Response) => {
  console.log('=== SEND REGISTER OTP FUNCTION CALLED ===');
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: 'Email field is required',
        success: false
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: 'Please provide a valid email address',
        success: false
      });
    }

    const isEmailAlreadyReg = await User.findOne({ email });
    if (isEmailAlreadyReg) {
      return res.status(400).json({
        message: `User with email ${email} already registered`,
        success: false
      });
    }

    // Rate limiting: Check if user has requested OTP in the last minute
    const recentOTP = await OTP.findOne({
      email,
      name: 'register_otp',
      createdAt: { $gte: new Date(Date.now() - 60000) } // 1 minute ago
    });

    if (recentOTP) {
      return res.status(429).json({
        message: 'Please wait 1 minute before requesting another OTP',
        success: false,
        retryAfter: 60
      });
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    });

    const hashedOTP = await bcrypt.hash(otp, 12);
    const newOTP = await OTP.create({ email, otp: hashedOTP, name: 'register_otp' });

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'Gmail', // Can be 'Gmail' or 'outlook'
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASSWORD
      },
      // Additional Gmail-specific settings
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Verification',
      html: `<p>Your OTP code is ${otp}</p>`
    };

    console.log('=== EMAIL DEBUG START ===');
    console.log('Attempting to send REGISTER OTP email to:', email);
    console.log('OTP code:', otp);

    // Write to file for debugging
    const fs = require('fs');
    const logData = {
      timestamp: new Date().toISOString(),
      email: email,
      otp: otp,
      config: {
        user: process.env.SENDER_EMAIL,
        passLength: process.env.SENDER_EMAIL_PASSWORD?.length,
        hasPass: !!process.env.SENDER_EMAIL_PASSWORD
      }
    };
    fs.appendFileSync('./email-debug.log', JSON.stringify(logData, null, 2) + '\n---\n');

    transporter.sendMail(mailOptions, function (err, info) {
      console.log('=== EMAIL SEND RESULT ===');

      const resultData = {
        timestamp: new Date().toISOString(),
        email: email,
        success: !err,
        error: err ? err.message : null,
        info: info
      };
      fs.appendFileSync('./email-debug.log', JSON.stringify(resultData, null, 2) + '\n===\n');

      if (err) {
        console.error('REGISTER Email ERROR:', err.message);
        console.error('Full error object:', err);
      } else {
        console.log('✅ REGISTER Email sent successfully!');
        console.log('Email info:', info);
      }
      console.log('=== EMAIL DEBUG END ===');
    });

    res.status(200).json({
      result: newOTP,
      message: 'Register OTP sent successfully',
      success: true
    });
  } catch (error) {
    res.status(404).json({
      message: 'Error in sendRegisterOTP - authController.ts',
      error,
      success: false
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({
        message: 'Please provide all required fields (name, email, password, otp)',
        success: false
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: 'Please provide a valid email address',
        success: false
      });
    }

    const isEmailAlreadyReg = await User.findOne({ email });
    if (isEmailAlreadyReg) {
      return res.status(400).json({
        message: `User with email ${email} already registered`,
        success: false
      });
    }

    const otpHolder = await OTP.find({ email });
    if (otpHolder.length === 0) {
      return res.status(400).json({
        message: 'You have entered an expired OTP',
        success: false
      });
    }

    const registerOtps = otpHolder.filter(otp => otp.name === 'register_otp');
    const findedOTP = registerOtps[registerOtps.length - 1];

    const plainOTP = otp;
    const hashedOTP = findedOTP.otp;

    const isValidOTP = await bcrypt.compare(plainOTP, hashedOTP);

    if (isValidOTP) {
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        name,
        email,
        password: hashedPassword
      });

      await newUser.generateAuthToken();
      await OTP.deleteMany({ email: findedOTP.email });
      await newUser.save();

      return res.status(200).json({
        result: newUser,
        message: 'Registration successful',
        success: true
      });
    } else {
      return res.status(200).json({
        message: 'Wrong OTP',
        success: false
      });
    }

  } catch (error) {
    res.status(404).json({
      message: 'Error in register - authController.ts',
      error,
      success: false
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide all required fields (email, password)',
        success: false
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: 'Please provide a valid email address',
        success: false
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        message: 'Invalid credentials',
        success: false
      });
    }

    const plainPassword = password;
    const hashedPassword = existingUser.password;
    const isPasswordCorrect = await bcrypt.compare(plainPassword, hashedPassword);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: 'Invalid credentials',
        success: false
      });
    }

    const isTokenExist = Boolean(existingUser.tokens?.find(token => token.name === 'auth_token'));
    if (isTokenExist) {
      return res.status(201).json({
        result: existingUser,
        message: `User with email ${email} already logged in`,
        success: true
      });
    }

    const token = jwt.sign(
      { email, password, _id: existingUser._id },
      process.env.AUTH_TOKEN_SECRET_KEY || 'default_secret_key'
    );

    const tokenObj = { name: 'auth_token', token };
    existingUser.tokens = existingUser.tokens.concat(tokenObj);
    const result = await User.findByIdAndUpdate(existingUser._id, existingUser, { new: true });

    res.status(200).json({
      result,
      message: 'Login successful',
      success: true
    });
  } catch (error) {
    res.status(404).json({
      message: 'Login failed - authController.ts',
      error,
      success: false
    });
  }
};

export const sendForgetPasswordOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const isEmailAlreadyReg = await User.findOne({ email });

    if (!email) {
      return res.status(400).json({
        message: 'Email field is required',
        success: false
      });
    }

    if (!isEmailAlreadyReg) {
      return res.status(400).json({
        message: `No user exists with email ${email}`,
        success: false
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: 'Please provide a valid email address',
        success: false
      });
    }

    // Rate limiting: Check if user has requested OTP in the last minute
    const recentOTP = await OTP.findOne({
      email,
      name: 'forget_password_otp',
      createdAt: { $gte: new Date(Date.now() - 60000) } // 1 minute ago
    });

    if (recentOTP) {
      return res.status(429).json({
        message: 'Please wait 1 minute before requesting another OTP',
        success: false,
        retryAfter: 60
      });
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    });

    const hashedOTP = await bcrypt.hash(otp, 12);
    const newOTP = await OTP.create({ email, otp: hashedOTP, name: 'forget_password_otp' });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Verification',
      html: `<p>Your OTP code is ${otp}</p>`
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log('Email error:', err);
      }
    });

    res.status(200).json({
      result: newOTP,
      otp,
      message: 'Forget password OTP sent successfully',
      success: true
    });

  } catch (error) {
    res.status(404).json({
      message: 'Error in sendForgetPasswordOTP - authController.ts',
      error,
      success: false
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { email, password, otp } = req.body;

    if (!email || !password || !otp) {
      return res.status(400).json({
        message: 'Please provide all required fields (email, password, otp)',
        success: false
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: 'Please provide a valid email address',
        success: false
      });
    }

    const findedUser = await User.findOne({ email });
    if (!findedUser) {
      return res.status(400).json({
        message: `User with email ${email} does not exist`,
        success: false
      });
    }

    const otpHolder = await OTP.find({ email });
    if (otpHolder.length === 0) {
      return res.status(400).json({
        message: 'You have entered an expired OTP',
        success: false
      });
    }

    const forgPassOtps = otpHolder.filter(otp => otp.name === 'forget_password_otp');
    const findedOTP = forgPassOtps[forgPassOtps.length - 1];

    const plainOTP = otp;
    const hashedOTP = findedOTP.otp;

    const isValidOTP = await bcrypt.compare(plainOTP, hashedOTP);

    if (isValidOTP) {
      const hashedPassword = await bcrypt.hash(password, 12);
      const result = await User.findByIdAndUpdate(
        findedUser._id,
        { name: findedUser.name, email, password: hashedPassword },
        { new: true }
      );

      await OTP.deleteMany({ email: findedOTP.email });

      return res.status(200).json({
        result,
        message: 'Password changed successfully',
        success: true
      });
    } else {
      return res.status(200).json({
        message: 'Wrong OTP',
        success: false
      });
    }

  } catch (error) {
    res.status(404).json({
      message: 'Error in changePassword - authController.ts',
      error,
      success: false
    });
  }
};

export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await User.deleteMany();
    res.status(200).json({
      result,
      message: 'User collection deleted successfully',
      success: true
    });

  } catch (err) {
    res.status(404).json({
      message: 'Error in deleteAllUsers - authController.ts',
      success: false
    });
  }
};
