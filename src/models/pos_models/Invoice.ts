import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  invoiceId: string;
  customerPhone: string;
  date: Date;
  subtotal: number;
  tax: number;
  total: number;
}

const InvoiceSchema: Schema = new Schema({
  invoiceId: { type: String, required: true, unique: true },
  customerPhone: { type: String, required: true },
  date: { type: Date, required: true },
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
});

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);
