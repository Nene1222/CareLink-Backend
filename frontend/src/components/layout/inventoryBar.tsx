import React from 'react';
import '../../assets/style/layout/inventoryBar.css';

interface InventoryBarProps {
  onBack?: () => void;
  showBackButton?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearchBar?: boolean;
}

const InventoryBar: React.FC<InventoryBarProps> = ({
  onBack,
  showBackButton = false,
  searchValue = '',
  onSearchChange,
  showSearchBar = true
}) => {
  return (
    <div className="inventory-bar">
      <div className="inventory-bar-left">
        {showBackButton && onBack && (
          <button className="back-button" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}
        <div>
          <h1 className="inventory-title">Pharmacy Inventory</h1>
          <p className="inventory-subtitle">Manage and monitor medicine stock</p>
        </div>
      </div>
      {showSearchBar && (
        <div className="inventory-bar-right">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryBar;
