// lib/auth/patientAuth.ts - NEW FILE
import { verifyAuth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Patient from "@/lib/models/Patient";
import { NextRequest } from "next/server";

export interface PatientAuthResult {
  patientId: string;      // Patient._id
  userId: string;         // User._id
  patientName: string;
  patientCode: string;
  patientEmail: string;
  patientPhone?: string;
}

export interface AuthError {
  error: string;
  status: number;
}

export async function verifyPatientAuth(request: NextRequest): Promise<PatientAuthResult | AuthError> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return {
        error: "No token provided",
        status: 401
      };
    }
    
    const token = authHeader.replace("Bearer ", "");
    
    // Verify token
    const decoded = await verifyAuth(token);
    
    // Check if user is a patient
    if (decoded.role !== "patient") {
      return {
        error: "Access denied. Patients only.",
        status: 403
      };
    }
    
    await dbConnect();
    
    // Find patient by user field (which references User._id)
    const patient = await Patient.findOne({ user: decoded.userId });
    
    if (!patient) {
      return {
        error: "Patient profile not found. Please complete your profile.",
        status: 404
      };
    }
    
    return {
      patientId: patient._id.toString(),
      userId: decoded.userId,
      patientName: patient.name,
      patientCode: patient.patientCode,
      patientEmail: patient.email,
      patientPhone: patient.phoneNumber
    };
    
  } catch (error) {
    console.error("Patient auth verification error:", error);
    return {
      error: "Invalid or expired token",
      status: 401
    };
  }
}