import mongoose from 'mongoose';

const NurseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: String,
  shift: String,
  qualification: [String],
  licenseNumber: { type: String, required: true },
  specializations: [String],
  assignedWard: String
}, { timestamps: true });

export default mongoose.models.Nurse || mongoose.model('Nurse', NurseSchema);