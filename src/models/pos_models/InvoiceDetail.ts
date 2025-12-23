import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceDetail extends Document {
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemQuantity: number;
  itemTotalPrice: number;
}

const InvoiceDetailSchema: Schema = new Schema({
  invoiceId: { type: String, required: true },
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  itemPrice: { type: Number, required: true },
  itemQuantity: { type: Number, required: true },
  itemTotalPrice: { type: Number, required: true },
});

export default mongoose.model<IInvoiceDetail>('InvoiceDetail', InvoiceDetailSchema);
