// backend/src/models/appointment.ts
import { Schema, model, Document } from 'mongoose'

export interface IAppointment extends Document {
  patientName: string
  patientId: string
  doctorName: string
  service?: string      // descriptive clinic service (X-Ray, Lab, Vaccination...)
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
    service: String,             // NEW: clinic service
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
