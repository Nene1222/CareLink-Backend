import { Schema, model, Document, Types } from 'mongoose'

export interface IAppointment extends Document {
  patientName: string
  patientId: string
  doctorName: string
  doctorRole?: string
  date: string
  time: string
  room?: string
  reason?: string
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    patientName: { type: String, required: true },
    patientId: { type: String, required: true },
    doctorName: { type: String, required: true },
    doctorRole: String,
    date: { type: String, required: true }, // yyyy-mm-dd
    time: { type: String, required: true },
    room: String,
    reason: String,
    notes: String,
  },
  { timestamps: true }
)

// useful indexes
AppointmentSchema.index({ date: 1, time: 1 })
AppointmentSchema.index({ patientId: 1 })

export const Appointment = model<IAppointment>('Appointment', AppointmentSchema)