import { Schema, model, Document, Types } from 'mongoose'

export interface IBatch extends Document {
  medicine_id: Types.ObjectId
  supplier: string
  quantity: number
  purchase_date: Date
  expiry_date: Date
  purchase_price: number
  setting_price: number
  deleted_at?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

const BatchSchema = new Schema<IBatch>(
  {
    medicine_id: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
    supplier: { type: String, required: true, trim: true, maxlength: 100 },
    quantity: { type: Number, required: true, min: 0 },
    purchase_date: { type: Date, required: true },
    expiry_date: { type: Date, required: true },
    purchase_price: { type: Number, required: true, min: 0 },
    setting_price: { type: Number, required: true, min: 0 },
    deleted_at: { type: Date, default: null },
  },
  { timestamps: true }
)

BatchSchema.index({ medicine_id: 1 })
BatchSchema.index({ expiry_date: 1 })

export const Batch = model<IBatch>('Batch', BatchSchema)
