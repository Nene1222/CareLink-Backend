import mongoose from 'mongoose';

const PharmacistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  licenseNumber: { type: String, required: true },
  qualification: [String],
  shift: String,
  specialization: String
}, { timestamps: true });

export default mongoose.models.Pharmacist || mongoose.model('Pharmacist', PharmacistSchema);