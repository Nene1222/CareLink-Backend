// lib/models/Doctor.ts
import mongoose from 'mongoose';

export interface IDoctor {
  _id: mongoose.Types.ObjectId;
  staff: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  doctorCode: string; // Unique code like DR001, DR002
  specialization: string;
  department?: string;
  experience: string; // e.g., "10 years"
  education: string;
  qualifications?: string[];
  consultationFee: number;
  bio?: string;
  languages?: string[];
  awards?: string[];
  publications?: string[];
  availableDays?: string[]; // e.g., ["Monday", "Wednesday", "Friday"]
  availableHours?: {
    start: string; // e.g., "09:00"
    end: string;   // e.g., "17:00"
  };
  isAvailable: boolean;
  rating?: number; // 1-5 stars
  totalPatients?: number;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new mongoose.Schema<IDoctor>(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorCode: {
      type: String,
      required: true,
      unique: true, // This creates an index automatically
      uppercase: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true
    },
    education: {
      type: String,
      trim: true
    },
    qualifications: [{
      type: String,
      trim: true
    }],
    consultationFee: {
      type: Number,
      min: 0
    },
    bio: {
      type: String,
      trim: true
    },
    languages: [{
      type: String,
      trim: true
    }],
    awards: [{
      type: String,
      trim: true
    }],
    publications: [{
      type: String,
      trim: true
    }],
    availableDays: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    availableHours: {
      start: {
        type: String,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
      },
      end: {
        type: String,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
      }
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    totalPatients: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Define indexes here - DO NOT duplicate field-level indexes
DoctorSchema.index({ doctorCode: 1 }); // Already unique, but explicit index
DoctorSchema.index({ staff: 1 }, { unique: true }); // One doctor per staff
DoctorSchema.index({ user: 1 }, { unique: true }); // One doctor per user
DoctorSchema.index({ specialization: 1 });
DoctorSchema.index({ department: 1 });
DoctorSchema.index({ isAvailable: 1 });

// Composite indexes for common queries
DoctorSchema.index({ specialization: 1, isAvailable: 1 });
DoctorSchema.index({ specialization: 1, department: 1 });
DoctorSchema.index({ isAvailable: 1, rating: -1 });

// Virtual populate to get staff and user details when querying doctors
DoctorSchema.virtual('staffDetails', {
  ref: 'Staff',
  localField: 'staff',
  foreignField: '_id',
  justOne: true
});

DoctorSchema.virtual('userDetails', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true
});

// Static method to generate doctor code
DoctorSchema.statics.generateDoctorCode = async function(): Promise<string> {
  try {
    const latestDoctor = await this.findOne().sort({ doctorCode: -1 }).limit(1);
    
    if (!latestDoctor) {
      return 'DR001'; // First doctor
    }
    
    const match = latestDoctor.doctorCode.match(/DR(\d+)/);
    if (match && match[1]) {
      const latestNumber = parseInt(match[1], 10);
      const nextNumber = latestNumber + 1;
      return `DR${nextNumber.toString().padStart(3, '0')}`;
    }
    
    return 'DR001';
  } catch (error) {
    const count = await this.countDocuments();
    return `DR${(count + 1).toString().padStart(3, '0')}`;
  }
};

// Add static method to DoctorSchema
interface DoctorModel extends mongoose.Model<IDoctor> {
  generateDoctorCode(): Promise<string>;
}

// Pre-save middleware to ensure consistency
DoctorSchema.pre('save', async function() {
  // If doctorCode is not set, generate one
  if (!this.doctorCode) {
    const Doctor = this.constructor as DoctorModel;
    this.doctorCode = await Doctor.generateDoctorCode();
  }
  
  // Ensure doctorCode is uppercase
  this.doctorCode = this.doctorCode.toUpperCase();
});

// Add method to get full doctor details with populated staff and user
DoctorSchema.methods.getFullDetails = async function() {
  await this.populate([
    { 
      path: 'staffDetails',
      select: 'name email phoneNumber specialization status'
    },
    {
      path: 'userDetails',
      select: 'username email role isActive isVerified'
    }
  ]);
  
  return this;
};

const Doctor: DoctorModel = (mongoose.models.Doctor as DoctorModel) || mongoose.model<IDoctor, DoctorModel>('Doctor', DoctorSchema);

export default Doctor;