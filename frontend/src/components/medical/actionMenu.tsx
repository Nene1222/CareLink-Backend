import React, { useEffect, useRef } from 'react';
import '../../assets/style/medical/actionMenu.css';

interface ActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  onViewDetails: () => void;
  onEditRecord: () => void;
  onDownloadPDF: () => void;
  onDeleteRecord: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  isOpen,
  onClose,
  position,
  onViewDetails,
  onEditRecord,
  onDownloadPDF,
  onDeleteRecord,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="action-menu"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="action-menu-header">
        <h3>Actions</h3>
      </div>

      <div className="action-menu-section">
        <button className="action-menu-item" onClick={onViewDetails}>
          <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>View Details</span>
        </button>

        <button className="action-menu-item" onClick={onEditRecord}>
          <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Edit Record</span>
        </button>

        <button className="action-menu-item" onClick={onDownloadPDF}>
          <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="7 10 12 15 17 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="15" x2="12" y2="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Download PDF</span>
        </button>
      </div>

      <div className="action-menu-divider"></div>

      <div className="action-menu-section">
        <button className="action-menu-item delete" onClick={onDeleteRecord}>
          <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="3 6 5 6 21 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Delete Record</span>
        </button>
      </div>
    </div>
  );
};

export default ActionMenu;