import { Schema, model, Document } from 'mongoose';

export interface IOTP extends Document {
  name: string;
  email: string;
  otp: string;
  createdAt: Date;
}

const otpSchema = new Schema<IOTP>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: 300 }, // OTP expires after 5 minutes (300 seconds)
  },
}, { timestamps: true });

const OTP = model<IOTP>('OTP', otpSchema);
export default OTP;
