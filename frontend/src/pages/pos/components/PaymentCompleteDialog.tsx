import { CheckCircle2, Printer, X } from 'lucide-react';
import type{ CartItem } from '../types'; // make sure path is correct

interface PaymentCompleteDialogProps {
  invoiceId: string;
  customerPhone: string;
  date: string;
  address: string;
  cartItems: CartItem[];
  onClose: () => void;
}

export const PaymentCompleteDialog = ({
  invoiceId,
  customerPhone,
  date,
  address,
  cartItems,
  onClose,
}: PaymentCompleteDialogProps) => {
  const handlePrint = () => {
    const printWindow = window.open('', 'PRINT', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Invoice</title></head><body>');
      printWindow.document.write('<h1 style="text-align:center;">Food Delivery App</h1>');
      printWindow.document.write(`<p>Invoice ID: ${invoiceId}</p>`);
      printWindow.document.write(`<p>Customer Name: ${customerPhone}</p>`);
      printWindow.document.write(`<p>Date: ${date}</p>`);
      printWindow.document.write(`<p>Address: ${address}</p>`);

      // Table
      printWindow.document.write('<table border="1" style="width:100%;border-collapse:collapse;margin-top:10px;">');
      printWindow.document.write('<tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>');
      cartItems.forEach(item => {
        printWindow.document.write(
          `<tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.unitPrice.toFixed(2)}</td>
            <td>${(item.quantity * item.unitPrice).toFixed(2)}</td>
          </tr>`
        );
      });
      printWindow.document.write('</table>');

      const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      // Calculate 6% tax
      const tax = subtotal * 0.06;
      // Calculate total
      const total = subtotal + tax;
      printWindow.document.write(`<p style="text-align:right;">Subtotal: $${subtotal.toFixed(2)}</p>`);
      printWindow.document.write(`<p style="text-align:right;">Tax (6%): $${tax.toFixed(2)}</p>`);
      printWindow.document.write(`<p style="text-align:right;font-weight:bold;">Total: $${total.toFixed(2)}</p>`);
      printWindow.document.write('</body></html>');

      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Complete</h2>
          <p className="text-gray-600">Your transaction has been processed successfully</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-5 h-5" />
            Print Invoice
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
