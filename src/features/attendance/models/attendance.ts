import { Schema, model, Document, Types } from 'mongoose'

export interface IAttendance extends Document {
  profile?: string
  name: string
  staffId: string
  role?: string
  organizationId?: Types.ObjectId
  organization?: string // kept for backward compatibility if needed
  networkId?: Types.ObjectId
  room?: string
  shift?: string
  checkInTime?: string
  checkOutTime?: string
  date: string
  status: 'present' | 'absent' | 'late'
  approval?: 'pending' | 'accepted' | 'rejected'
  notes?: string
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    profile: String,
    name: { type: String, required: true },
    staffId: { type: String, required: true },
    role: String,
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    organization: String, // optional denormalized name
    networkId: { type: Schema.Types.ObjectId, ref: 'Network' },
    room: String,
    shift: String,
    checkInTime: String,
    checkOutTime: String,
    date: { type: String, required: true },
    status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
    approval: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    notes: String,
  },
  { timestamps: true }
)

// indexes for common queries
AttendanceSchema.index({ staffId: 1, date: 1 })
AttendanceSchema.index({ organizationId: 1, date: 1 })
AttendanceSchema.index({ date: 1, status: 1 })

export const Attendance = model<IAttendance>('Attendance', AttendanceSchema)