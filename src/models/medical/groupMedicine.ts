import { Schema, model, Document } from 'mongoose'

export interface IGroupMedicine extends Document {
  group_name: string
  deleted_at?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

const GroupMedicineSchema = new Schema<IGroupMedicine>(
  {
    group_name: { type: String, required: true, trim: true, maxlength: 100 },
    deleted_at: { type: Date, default: null },
  },
  { timestamps: true }
)

export const GroupMedicine = model<IGroupMedicine>('GroupMedicine', GroupMedicineSchema)
