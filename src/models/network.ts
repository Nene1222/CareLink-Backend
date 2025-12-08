import { Schema, model, Document } from 'mongoose'

export interface INetwork extends Document {
  name: string
  ipAddress: string
}

const NetworkSchema = new Schema<INetwork>(
  {
    name: { type: String, required: true },
    ipAddress: { type: String, required: true },
  },
  { timestamps: true }
)

// index for quick lookups and uniqueness on IP
NetworkSchema.index({ ipAddress: 1 }, { unique: true, sparse: true })
NetworkSchema.index({ name: 1 })

export const Network = model<INetwork>('Network', NetworkSchema)