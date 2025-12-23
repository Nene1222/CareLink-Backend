import express from 'express';
import { createInvoice, getInvoices, getInvoiceDetails } from '../../controllers/pos_controllers/InvoiceController';

const router = express.Router();

// Create invoice + details
router.post('/', createInvoice);

// Get all invoices
router.get('/', getInvoices);

// Get invoice details by invoiceId
router.get('/:invoiceId/details', getInvoiceDetails);

export default router;
