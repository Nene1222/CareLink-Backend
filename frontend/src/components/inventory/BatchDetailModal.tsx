import React from 'react';
import '../../assets/style/inventory/batchDetailModal.css';

interface BatchDetailData {
  batchNo: string;
  supplier: string;
  quantity: number;
  purchaseDate: string;
  expiryDate: string;
  purchasingPrice: number;
  settingPrice: number;
  priceUnit: string;
}

interface BatchDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchDetail: BatchDetailData;
  onEdit?: () => void;
  onDelete?: () => void;
}

const BatchDetailModal: React.FC<BatchDetailModalProps> = ({
  isOpen,
  onClose,
  batchDetail,
  onEdit,
  onDelete
}) => {
  if (!isOpen) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button (X) */}
        <button className="close-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Title */}
        <h2 className="modal-title">Batch No {batchDetail.batchNo}</h2>

        {/* Batch Details */}
        <div className="batch-details">
          <div className="detail-row">
            <span className="detail-label">Supplier:</span>
            <span className="detail-value">{batchDetail.supplier}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Quantity:</span>
            <span className="detail-value">{batchDetail.quantity}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Purchase Date:</span>
            <span className="detail-value">{batchDetail.purchaseDate}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Expiry Date:</span>
            <span className="detail-value">{batchDetail.expiryDate}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Purchasing Price:</span>
            <span className="detail-value">{batchDetail.purchasingPrice} per {batchDetail.priceUnit}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Setting Price:</span>
            <span className="detail-value">{batchDetail.settingPrice} per {batchDetail.priceUnit}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button className="btn-edit" onClick={handleEdit}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default BatchDetailModal;

