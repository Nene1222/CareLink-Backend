import { ShoppingCart } from 'lucide-react';
import type{ Medicine } from '../types';
import { getStockStatus, getStockBadgeColor } from '../utils/helpers';

interface MedicineCardProps {
  medicine: Medicine;
  onAddToCart: (medicine: Medicine) => void;
}

export const MedicineCard = ({ medicine, onAddToCart }: MedicineCardProps) => {
  const stockStatus = getStockStatus(medicine.quantity);
  const badgeColor = getStockBadgeColor(medicine.quantity);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={medicine.image}
          alt={medicine.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{medicine.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{medicine.type}</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-gray-900">${medicine.price.toFixed(2)}</span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${badgeColor}`}>
            {stockStatus.label} ({medicine.quantity})
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-3">Barcode: {medicine.barcode}</p>
        <button
          onClick={() => onAddToCart(medicine)}
          disabled={medicine.quantity === 0}
          className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors ${
            medicine.quantity === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};
