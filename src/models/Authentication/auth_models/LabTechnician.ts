import mongoose from 'mongoose';

const LabTechnicianSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: [String],
  qualification: [String],
  licenseNumber: String,
  shift: String,
  laboratorySection: String
}, { timestamps: true });

export default mongoose.models.LabTechnician || mongoose.model('LabTechnician', LabTechnicianSchema);