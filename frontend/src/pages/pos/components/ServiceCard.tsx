import { ShoppingCart } from 'lucide-react';
import type{ Service } from '../types';
import { formatDuration, getServiceStatus } from '../utils/helpers';

interface ServiceCardProps {
  service: Service;
  onAddToCart: (service: Service) => void;
}

export const ServiceCard = ({ service, onAddToCart }: ServiceCardProps) => {
  const status = getServiceStatus(service.patientId);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-lg">{service.name}</h3>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Duration:</span>
          <span className="font-medium text-gray-900">{formatDuration(service.durationMinutes)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Room:</span>
          <span className="font-medium text-gray-900">{service.roomNumber}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Price:</span>
          <span className="text-xl font-bold text-gray-900">${service.price.toFixed(2)}</span>
        </div>
      </div>

      {service.patientId && service.patientName && (
        <div className="mb-4 p-2 bg-orange-50 rounded-md border border-orange-200">
          <p className="text-xs text-orange-800">
            <span className="font-medium">Patient:</span> {service.patientName}
          </p>
        </div>
      )}

      <button
        onClick={() => onAddToCart(service)}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-blue-700 transition-colors"
      >
        <ShoppingCart className="w-4 h-4" />
        Add to Cart
      </button>
    </div>
  );
};
