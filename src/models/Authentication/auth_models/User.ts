// lib/models/User.ts
import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export type OTPType = "registration" | "password-reset" | null;

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string; // Now stores role name as string (lowercase)
  isActive: boolean;
  isVerified: boolean;
  lastLogin?: Date;
  profileImage?: string;
  contactNumber?: string;
  otp?: {
    code?: string;
    type?: OTPType;
    expiresAt?: Date;
    attempts?: number;
  };
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(password: string): Promise<boolean>;
  generateOTP(type: "registration" | "password-reset"): string;
  verifyOTP(enteredOTP: string): boolean;
  isOTPValid(): boolean;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      default: "patient",
      required: true,
    },

    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    lastLogin: Date,
    profileImage: String,
    contactNumber: String,

    otp: {
      code: String,
      type: {
        type: String,
        enum: ["registration", "password-reset", null],
        default: null,
      },
      expiresAt: Date,
      attempts: { type: Number, default: 0 },
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err as any);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (this: IUser, password: string) {
  return bcrypt.compare(password, this.password);
};

// Generate OTP method
UserSchema.methods.generateOTP = function (this: IUser, type: "registration" | "password-reset") {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  this.otp = {
    code: otp,
    type: type,
    expiresAt: expiresAt,
    attempts: 0,
  };

  return otp;
};

// Verify OTP method
UserSchema.methods.verifyOTP = function (this: IUser, enteredOTP: string): boolean {
  if (!this.otp || !this.otp.code) return false;

  if (this.otp.expiresAt && this.otp.expiresAt < new Date()) {
    this.otp = undefined as any;
    return false;
  }

  if (this.otp.code === enteredOTP) {
    const wasRegistration = this.otp.type === "registration";
    this.otp = undefined as any;

    if (wasRegistration) {
      this.isVerified = true;
    }
    return true;
  }

  if (typeof this.otp.attempts === "number") {
    this.otp.attempts = (this.otp.attempts || 0) + 1;
    if (this.otp.attempts >= 5) {
      this.otp = undefined as any;
    }
  }

  return false;
};

// Check if OTP is valid
UserSchema.methods.isOTPValid = function (this: IUser): boolean {
  return (
    !!this.otp &&
    !!this.otp.code &&
    !!this.otp.expiresAt &&
    this.otp.expiresAt > new Date() &&
    (this.otp.attempts ?? 0) < 5
  );
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;