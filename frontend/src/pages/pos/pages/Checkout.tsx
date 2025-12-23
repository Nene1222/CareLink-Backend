import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type{ CartItem } from '../types';
import { convertUSDToRiel, convertRielToUSD } from '../utils/helpers';
import QRCodeCanvas  from 'react-qr-code';

interface CheckoutProps {
  invoiceId: string;
  date: string;
  customerPhone: string;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  onClose: () => void;
  onComplete: () => void;
}

export const Checkout = ({
  invoiceId,
  date,
  customerPhone,
  cartItems,
  subtotal,
  tax,
  total,
  onClose,
  onComplete,
}: CheckoutProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qr'>('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'KHR'>('USD');
  const [qrPaid, setQrPaid] = useState(false);

  // Added states for QR functionality
  const [qrData, setQrData] = useState<{ qr: string; md5: string } | null>(null);
  // const baseURL = 'http://localhost:3000'; // your backend base URL

  const totalInRiel = convertUSDToRiel(total);

  const calculateChange = () => {
    const received = parseFloat(cashReceived) || 0;
    if (currency === 'USD') {
      return {
        usd: Math.max(0, received - total),
        khr: convertUSDToRiel(Math.max(0, received - total)),
      };
    } else {
      const receivedInUSD = convertRielToUSD(received);
      return {
        usd: Math.max(0, receivedInUSD - total),
        khr: Math.max(0, received - totalInRiel),
      };
    }
  };

  const change = calculateChange();

  const handleComplete = () => {
    if (paymentMethod === 'cash' && parseFloat(cashReceived) < (currency === 'USD' ? total : totalInRiel)) {
      alert('Insufficient payment amount');
      return;
    }
    if (paymentMethod === 'qr' && !qrPaid) {
      alert('Please wait for payment confirmation');
      return;
    }
    onComplete();
  };

  // --- Added: QR creation and polling ---
  // const startPolling = (md5: string) => {
  //   if (pollingRef.current) clearInterval(pollingRef.current);

  //   pollingRef.current = window.setInterval(async () => {
  //     try {
  //       const res = await fetch(`/api/payment/check`, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ md5 }),
  //       });
  //       const data = await res.json();
  //       if (data.status === 'paid') {
  //         setQrPaid(true);
  //         if (pollingRef.current) clearInterval(pollingRef.current);
  //       }
  //     } catch (err) {
  //       console.error('Polling error', err);
  //     }
  //   }, 3000);
  // };

  // useEffect(() => {
  //   if (paymentMethod === 'qr' && !qrData) {
  //     const createQR = async () => {
  //       try {
  //         const res = await fetch(`/api/payment/create`, {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({ amount: total }),
  //         });
  //         const data = await res.json();
  //         setQrData(data);
  //         console.log(data.md5)
  //         startPolling(data.md5);
  //       } catch (err) {
  //         console.error('QR generation error', err);
  //       }
  //     };
  //     createQR();
  //   } else if (paymentMethod !== 'qr') {
  //     if (pollingRef.current) clearInterval(pollingRef.current);
  //     setQrPaid(false);
  //     setQrData(null);
  //   }
  // }, [paymentMethod, total]);

  useEffect(() => {
    let pollingInterval: number | null = null; // <-- browser setInterval returns number

    if (paymentMethod === "qr") {
      const fetchQrAndPoll = async () => {
        setQrPaid(false);
        setQrData(null);

        try {
          // 1️⃣ Request QR from backend
          const res = await fetch(`/api/payment/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: total }),
          });
          const qrResponse = await res.json();
          setQrData(qrResponse);

          const startTime = Date.now();

          // 2️⃣ Start polling every 3s until paid or 1 min timeout
          pollingInterval = window.setInterval(async () => {  // <-- use window.setInterval
            if (Date.now() - startTime >= 60000) {
              clearInterval(pollingInterval!);
              console.log("Payment timeout");
              return;
            }

            try {
              const checkRes = await fetch(`/api/payment/check`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ md5: qrResponse.md5 }),
              });
              const checkData = await checkRes.json();
              console.log(checkData)
              console.log(qrResponse.md5)

              if (checkData.toLowerCase() === "paid") {
                setQrPaid(true);
                clearInterval(pollingInterval!);
              }
            } catch (err) {
              console.error("Polling error:", err);
            }
          }, 3000);
        } catch (err) {
          console.error("QR generation error:", err);
        }
      };

      fetchQrAndPoll();
    }

    // Cleanup on tab switch or unmount
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [paymentMethod, total]);


  // --- Everything below is your original code unchanged ---
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Checkout</h2>
          <button onClick={onClose} className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Invoice</h3>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice ID:</span>
                  <span className="font-medium">{invoiceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Phone:</span>
                  <span className="font-medium">{customerPhone || 'N/A'}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="font-medium text-gray-700 mb-1">Clinic Address:</p>
                <p className="text-sm text-gray-600">123 Medical Center Street</p>
                <p className="text-sm text-gray-600">Phnom Penh, Cambodia</p>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-gray-500">
                          {item.quantity} × ${item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (6%):</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    paymentMethod === 'cash'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cash Payment
                </button>
                <button
                  onClick={() => setPaymentMethod('qr')}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    paymentMethod === 'qr'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  QR Payment
                </button>
              </div>

              {paymentMethod === 'cash' && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Cash Payment</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">≈ {totalInRiel.toLocaleString()} KHR</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Currency
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrency('USD')}
                          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                            currency === 'USD'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          USD
                        </button>
                        <button
                          onClick={() => setCurrency('KHR')}
                          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                            currency === 'KHR'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          KHR
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cash Received ({currency})
                      </label>
                      <input
                        type="number"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        placeholder={`Enter amount in ${currency}`}
                        step={currency === 'USD' ? '0.01' : '100'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      />
                    </div>

                    {cashReceived && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Change</p>
                        <p className="text-2xl font-bold text-green-700">
                          ${change.usd.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          ≈ {change.khr.toLocaleString()} KHR
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {paymentMethod === 'qr' && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">QR Payment</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</p>
                    </div>

                    <div className="bg-white border-2 border-gray-300 rounded-lg p-6 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                          <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                            {qrData ? (
                              <QRCodeCanvas value={qrData.qr} size={200} />
                            ) : (
                              <p className="text-gray-500 text-sm">Generating QR...</p>
                            )}
                          </div>



                        </div>
                        <p className="text-sm text-gray-600">Scan to pay</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-4">
                      <span className="text-sm font-medium text-gray-700">Payment Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          qrPaid
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {qrPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>

                    <button
                      onClick={() => setQrPaid(!qrPaid)}
                      className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                    >
                      Simulate Payment {qrPaid ? 'Reset' : 'Confirmation'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleComplete}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Complete Payment
          </button>
        </div>
      </div>
    </div>
  );
};
