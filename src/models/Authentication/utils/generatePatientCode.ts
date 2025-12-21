// lib/utils/generatePatientCode.ts
import Patient from "@/lib/models/Patient";

export async function generatePatientCode(): Promise<string> {
  try {
    // Find the latest patient
    const latestPatient = await Patient.findOne().sort({ patientCode: -1 }).limit(1);
    
    if (!latestPatient) {
      return "P001"; // First patient
    }
    
    // Extract the number from the latest patient code (e.g., P001 -> 1)
    const latestCode = latestPatient.patientCode;
    const match = latestCode.match(/P(\d+)/);
    
    if (match && match[1]) {
      const latestNumber = parseInt(match[1], 10);
      const nextNumber = latestNumber + 1;
      return `P${nextNumber.toString().padStart(3, '0')}`;
    }
    
    // If pattern doesn't match, start from 1
    return "P001";
  } catch (error) {
    console.error("Error generating patient code:", error);
    // Fallback: generate based on count
    const count = await Patient.countDocuments();
    return `P${(count + 1).toString().padStart(3, '0')}`;
  }
}