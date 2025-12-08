import { Schema, model, Document, Types } from 'mongoose'

export interface IOrganization extends Document {
  name: string
  type?: string
  recordType?: string
  network?: Types.ObjectId
  logo?: string
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true },
    type: String,
    recordType: String,
    network: { type: Schema.Types.ObjectId, ref: 'Network' },
    logo: String,
  },
  { timestamps: true }
)

// index name for quick lookup (optional unique)
OrganizationSchema.index({ name: 1 }, { unique: false, sparse: true })
OrganizationSchema.index({ network: 1 })

export const Organization = model<IOrganization>('Organization', OrganizationSchema)