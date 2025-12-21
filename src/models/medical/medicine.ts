import { Schema, model, Document, Types } from 'mongoose'

export interface IMedicine extends Document {
  name: string
  group_medicine_id: Types.ObjectId
  description?: string | null
  photo?: string | null
  barcode_image?: string | null
  barcode_value?: string | null
  deleted_at?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

const MedicineSchema = new Schema<IMedicine>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    group_medicine_id: { type: Schema.Types.ObjectId, ref: 'GroupMedicine', required: true },
    description: { type: String, default: null },
    photo: { type: String, default: null },
    barcode_image: { type: String, default: null },
    barcode_value: { type: String, default: null },
    deleted_at: { type: Date, default: null },
  },
  { timestamps: true }
)

MedicineSchema.index({ group_medicine_id: 1 })
MedicineSchema.index({ name: 1 })

export const Medicine = model<IMedicine>('Medicine', MedicineSchema)
