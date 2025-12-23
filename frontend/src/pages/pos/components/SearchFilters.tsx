import { Search, ShoppingCart, ScanBarcode } from 'lucide-react';
import type{ Medicine, Service } from '../types';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  activeTab: 'medicines' | 'services';
  onTabChange: (tab: 'medicines' | 'services') => void;
  medicines: Medicine[];
  services: Service[];
  onToggleCart: () => void;
  onOpenScanner: () => void;
  cartItemCount: number;
}

export const SearchFilters = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  activeTab,
  onTabChange,
  medicines,
  services,
  onToggleCart,
  onOpenScanner,
  cartItemCount,
}: SearchFiltersProps) => {
  // Get unique medicine types and service names separately
  const medicineTypes = ['all', ...new Set(medicines.map((m) => m.type))];
  const serviceNames = ['all', ...new Set(services.map((s) => s.name))];

  // Get filter options based on active tab
  const filterOptions = activeTab === 'medicines' ? medicineTypes : serviceNames;
  const filterLabel = activeTab === 'medicines' ? 'Filter by Medicine Type' : 'Filter by Service';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      {/* Search Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <div className="flex-1 relative min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search medicines and services..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            style={{ textTransform: 'none' }}
          />
        </div>

        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={onOpenScanner}
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <ScanBarcode className="w-5 h-5" />
            <span className="hidden sm:inline">Scan</span>
          </button>
          <button
            onClick={onToggleCart}
            className="relative px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {filterLabel}
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            style={{ textTransform: 'none' }}
          >
            {filterOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'all'
                  ? `All ${activeTab === 'medicines' ? 'Medicine Types' : 'Services'}`
                  : option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 sm:ml-auto">
          <button
            onClick={() => onTabChange('medicines')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm shadow-sm ${
              activeTab === 'medicines'
                ? 'bg-blue-600 text-white shadow-blue-200'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            Medicines
          </button>
          <button
            onClick={() => onTabChange('services')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm shadow-sm ${
              activeTab === 'services'
                ? 'bg-blue-600 text-white shadow-blue-200'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            Services
          </button>
        </div>
      </div>
    </div>
  );
};
