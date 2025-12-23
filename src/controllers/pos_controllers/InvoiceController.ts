import mongoose from "mongoose";

import Invoice from '../../models/pos_models/Invoice';
import InvoiceDetail from '../../models/pos_models/InvoiceDetail';
import { Request, Response } from 'express';
// import Medicine from '../models/Medicine'; // import your Medicine model
import { Batch } from "../../models/medical/batch";


// Create Invoice + Invoice Details
// export const createInvoice = async (req: Request, res: Response) => {
//   try {
//     const { invoiceId, customerPhone, date, subtotal, tax, total, items } = req.body;

//     // Save invoice
//     const invoice = new Invoice({ invoiceId, customerPhone, date, subtotal, tax, total });
//     await invoice.save();

//     // Save invoice details
//     const invoiceDetails = items.map((item: any) => ({
//       invoiceId,
//       itemId: item.itemId,
//       itemName: item.itemName,
//       itemPrice: item.itemPrice,
//       itemQuantity: item.itemQuantity,
//       itemTotalPrice: item.itemTotalPrice,
//     }));

//     await InvoiceDetail.insertMany(invoiceDetails);

//     // Update medicine stock
//     for (const item of items) {
//       if (item.type === 'medicine') {
//         // Reduce the quantity in Medicine collection
//         await Medicine.findByIdAndUpdate(item.itemId, {
//           $inc: { quantity: -item.itemQuantity }
//         });
//       }
//     }

//     return res.status(201).json({ message: 'Invoice created successfully', invoice, invoiceDetails });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Error creating invoice', error });
//   }
// };

//======================================================
export const createInvoice = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { invoiceId, customerPhone, date, subtotal, tax, total, items } = req.body;

    // 1️⃣ Save invoice
    const invoice = new Invoice(
      { invoiceId, customerPhone, date, subtotal, tax, total },
      { session }
    );
    await invoice.save();

    // 2️⃣ Save invoice details
    const invoiceDetails = items.map((item: any) => ({
      invoiceId,
      itemId: item.itemId,
      itemName: item.itemName,
      itemPrice: item.itemPrice,
      itemQuantity: item.itemQuantity,
      itemTotalPrice: item.itemTotalPrice,
    }));

    await InvoiceDetail.insertMany(invoiceDetails, { session });

    // 3️⃣ Update medicine stock via Batch (FIFO / earliest expiry)
    for (const item of items) {
      if (item.type !== "medicine") continue;

      let remainingQty = item.itemQuantity;

      const batches = await Batch.find({
        medicine_id: item.itemId,
        quantity: { $gt: 0 },
        deleted_at: null,
      })
        .sort({ expiry_date: 1 }) // FEFO
        .session(session);

      for (const batch of batches) {
        if (remainingQty <= 0) break;

        const deductQty = Math.min(batch.quantity, remainingQty);

        batch.quantity -= deductQty;
        remainingQty -= deductQty;

        await batch.save({ session });
      }

      if (remainingQty > 0) {
        throw new Error(`Insufficient stock for medicine ${item.itemName}`);
      }
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Invoice created successfully",
      invoice,
      invoiceDetails,
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    console.error(error);
    return res.status(500).json({
      message: "Error creating invoice",
      error: error.message,
    });
  }
};



// Get all invoices
export const getInvoices = async (_req: Request, res: Response) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoices', error });
  }
};

// Get invoice details by invoiceId
export const getInvoiceDetails = async (req: Request, res: Response) => {
  try {
    const { invoiceId } = req.params;
    const details = await InvoiceDetail.find({ invoiceId });
    res.json(details);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoice details', error });
  }
};
