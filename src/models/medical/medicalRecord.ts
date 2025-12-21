import { Schema, model, Document, Types } from 'mongoose'

export interface IMedicalRecord extends Document {
  recordId: string
  
  // Patient Information
  patient: {
    name: string
    id: string
    gender: 'Female' | 'Male' | 'Other'
    dateOfBirth: Date
    age: number
    address: string
    contactNumber: string
  }
  
  // Visit Information
  visit: {
    dateOfVisit: Date
    doctor: string
    reasonOfVisit?: string
  }
  
  // Medical History
  medicalHistory: {
    allergiesStatus: 'no-known' | 'has-allergies'
    allergiesDetails?: string
    currentMedications?: string
    chronicDiseases: string[]
    chronicDiseasesDetails?: string
    pastSurgeries?: string
    familyHistories?: string
  }
  
  // Vital Signs
  vitalSigns: {
    height: number
    heightUnit: 'cm' | 'in'
    weight: number
    weightUnit: 'kg' | 'lb'
    bloodPressure?: string // Format: "120/80" or "systolic/diastolic"
    pulseRate?: number
    temperature?: number
    respiratoryRate?: number
    oxygenSaturation?: number
    bmi?: number // Calculated field
  }
  
  // Physical Examination
  physicalExamination: {
    generalAppearance?: string
    cardiovascular?: string
    respiratory?: string
    abdominal?: string
    neurological?: string
    additionalFindings?: string
  }
  
  // Diagnosis & Tests
  diagnosis: {
    diagnosis?: string
    testsOrdered?: string
  }
  
  // Treatment Plan
  treatmentPlan: {
    medicationsPrescribed?: string
    proceduresPerformed?: string
    instruction?: string
  }
  
  // Metadata
  status: 'Completed' | 'Daft'
  deleted_at?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

const MedicalRecordSchema = new Schema<IMedicalRecord>(
  {
    recordId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    
    // Patient Information
    patient: {
      name: { type: String, required: true, trim: true, maxlength: 200 },
      id: { type: String, required: true, trim: true, maxlength: 50, index: true },
      gender: { type: String, required: true, enum: ['Female', 'Male', 'Other'] },
      dateOfBirth: { type: Date, required: true },
      age: { type: Number, required: true, min: 0, max: 150 },
      address: { type: String, default: '', maxlength: 500 },
      contactNumber: { type: String, default: '', maxlength: 20 }
    },
    
    // Visit Information
    visit: {
      dateOfVisit: { type: Date, required: true, index: true },
      doctor: { type: String, required: true, trim: true, maxlength: 200, index: true },
      reasonOfVisit: { type: String, default: '', maxlength: 500 }
    },
    
    // Medical History
    medicalHistory: {
      allergiesStatus: {
        type: String,
        required: true,
        enum: ['no-known', 'has-allergies'],
        default: 'no-known'
      },
      allergiesDetails: { type: String, default: '', maxlength: 1000 },
      currentMedications: { type: String, default: '', maxlength: 1000 },
      chronicDiseases: { type: [String], default: [] },
      chronicDiseasesDetails: { type: String, default: '', maxlength: 1000 },
      pastSurgeries: { type: String, default: '', maxlength: 1000 },
      familyHistories: { type: String, default: '', maxlength: 1000 }
    },
    
    // Vital Signs
    vitalSigns: {
      height: { type: Number, required: true, min: 0 },
      heightUnit: { type: String, required: true, enum: ['cm', 'in'], default: 'cm' },
      weight: { type: Number, required: true, min: 0 },
      weightUnit: { type: String, required: true, enum: ['kg', 'lb'], default: 'kg' },
      bloodPressure: { type: String, default: '', maxlength: 20 },
      pulseRate: { type: Number, min: 0, max: 300 },
      temperature: { type: Number, min: 0, max: 50 },
      respiratoryRate: { type: Number, min: 0, max: 100 },
      oxygenSaturation: { type: Number, min: 0, max: 100 },
      bmi: { type: Number, min: 0, max: 100 }
    },
    
    // Physical Examination
    physicalExamination: {
      generalAppearance: { type: String, default: '', maxlength: 2000 },
      cardiovascular: { type: String, default: '', maxlength: 2000 },
      respiratory: { type: String, default: '', maxlength: 2000 },
      abdominal: { type: String, default: '', maxlength: 2000 },
      neurological: { type: String, default: '', maxlength: 2000 },
      additionalFindings: { type: String, default: '', maxlength: 2000 }
    },
    
    // Diagnosis & Tests
    diagnosis: {
      diagnosis: { type: String, default: '', maxlength: 2000, index: true },
      testsOrdered: { type: String, default: '', maxlength: 2000 }
    },
    
    // Treatment Plan
    treatmentPlan: {
      medicationsPrescribed: { type: String, default: '', maxlength: 2000 },
      proceduresPerformed: { type: String, default: '', maxlength: 2000 },
      instruction: { type: String, default: '', maxlength: 2000 }
    },
    
    // Metadata
    status: {
      type: String,
      required: true,
      enum: ['Completed', 'Daft'],
      default: 'Daft',
      index: true
    },
    deleted_at: { type: Date, default: null }
  },
  { timestamps: true }
)

// Indexes for efficient querying
// MedicalRecordSchema.index({ 'patient.id': 1 })
MedicalRecordSchema.index({ 'patient.name': 1 })
MedicalRecordSchema.index({ 'visit.dateOfVisit': -1 })
// MedicalRecordSchema.index({ 'visit.doctor': 1 })
MedicalRecordSchema.index({ status: 1, deleted_at: 1 })
MedicalRecordSchema.index({ createdAt: -1 })

// Compound index for common search queries
MedicalRecordSchema.index({ 
  'patient.name': 'text', 
  'patient.id': 'text', 
  'diagnosis.diagnosis': 'text',
  'visit.doctor': 'text',
  recordId: 'text'
})

// Pre-save hook to calculate BMI if height and weight are provided
MedicalRecordSchema.pre('save', async function() {
  if (this.vitalSigns && this.vitalSigns.height && this.vitalSigns.weight) {
    let heightInMeters: number
    
    // Convert height to meters
    if (this.vitalSigns.heightUnit === 'cm') {
      heightInMeters = this.vitalSigns.height / 100
    } else {
      // inches to meters
      heightInMeters = (this.vitalSigns.height * 2.54) / 100
    }
    
    // Convert weight to kg if needed
    let weightInKg = this.vitalSigns.weight
    if (this.vitalSigns.weightUnit === 'lb') {
      weightInKg = this.vitalSigns.weight * 0.453592
    }
    
    // Calculate BMI: weight (kg) / height (m)²
    if (heightInMeters > 0) {
      this.vitalSigns.bmi = Number((weightInKg / (heightInMeters * heightInMeters)).toFixed(2))
    }
  }
})

export const MedicalRecord = model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema)

