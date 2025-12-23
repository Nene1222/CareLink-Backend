import { Minus, Plus, Trash2 } from 'lucide-react';
import type{ CartItem } from '../types';

interface CartSectionProps {
  invoiceId: string;
  date: string;
  customerPhone: string;
  onCustomerPhoneChange: (phone: string) => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  subtotal: number;
  tax: number;
  total: number;
  onCancel: () => void;
  onCheckout: () => void;
}

export const CartSection = ({
  invoiceId,
  date,
  customerPhone,
  onCustomerPhoneChange,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  subtotal,
  tax,
  total,
  onCancel,
  onCheckout,
}: CartSectionProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 h-full flex flex-col">
      <div className="mb-4 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Cart</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Invoice ID:</span>
            <span className="font-medium text-gray-900">{invoiceId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium text-gray-900">
              {new Date(date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Customer Phone
        </label>
        <input
          type="tel"
          value={customerPhone}
          onChange={(e) => onCustomerPhoneChange(e.target.value)}
          placeholder="Enter phone number"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="mb-4 text-sm text-gray-600">
        <p className="font-medium text-gray-700 mb-1">Clinic Address:</p>
        <p>123 Medical Center Street</p>
        <p>Phnom Penh, Cambodia</p>
      </div>

      <div className="flex-1 overflow-y-auto mb-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Cart is empty</p>
            <p className="text-sm mt-1">Add items to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 flex-1">{item.name}</h4>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-600 hover:text-red-700 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                      className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">${item.unitPrice.toFixed(2)} each</p>
                    <p className="font-bold text-gray-900">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (6%):</span>
          <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
          <span>Total:</span>
          <span className="text-blue-600">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onCheckout}
          disabled={cartItems.length === 0}
          className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};
