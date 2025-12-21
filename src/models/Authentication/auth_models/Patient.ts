// lib/models/Patient.ts
import mongoose, { Document, Model } from "mongoose";

export interface IPatient extends Document {
  patientCode: string;
  user: mongoose.Types.ObjectId;
  name: string;
  email: string;
  dateOfBirth: Date;
  phoneNumber?: string;
  address?: string;
  gender: "male" | "female" | "other" | "prefer-not-to-say";
  emergencyContact?: {
    name?: string;
    phoneNumber?: string;
    relationship?: string;
  };
  medicalHistory?: Array<{
    condition?: string;
    diagnosis?: string;
    date?: Date;
  }>;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new mongoose.Schema<IPatient>(
  {
    patientCode: {
      type: String,
      required: true,
      unique: true,
      index: true, // safe index
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true, // safe index
    },
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    dateOfBirth: { type: Date, required: true },
    phoneNumber: { type: String },
    address: { type: String },

    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
      default: "prefer-not-to-say",
    },

    emergencyContact: {
      name: String,
      phoneNumber: String,
      relationship: String,
    },

    medicalHistory: [
      {
        condition: String,
        diagnosis: String,
        date: Date,
      },
    ],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Patient: Model<IPatient> =
  mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema);

export default Patient;
