import React, { useState, useEffect } from 'react';
import '../../assets/style/inventory/addBatchModal.css';

interface AddBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (batchData: {
    batchNo: string;
    supplier: string;
    quantity: number;
    purchaseDate: string;
    expiryDate: string;
    purchasingPrice: number;
    settingPrice: number;
  }) => void;
  medicineName: string;
}

const AddBatchModal: React.FC<AddBatchModalProps> = ({
  isOpen,
  onClose,
  onSave,
  medicineName
}) => {
  const [formData, setFormData] = useState({
    batchNo: '',
    supplier: '',
    quantity: '',
    purchaseDate: '',
    expiryDate: '',
    purchasingPrice: '',
    settingPrice: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        batchNo: '',
        supplier: '',
        quantity: '',
        purchaseDate: '',
        expiryDate: '',
        purchasingPrice: '',
        settingPrice: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.batchNo.trim()) {
      newErrors.batchNo = 'Batch No. is required';
    }
    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Supplier is required';
    }
    if (!formData.quantity.trim() || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase Date is required';
    }
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry Date is required';
    }
    if (!formData.purchasingPrice.trim() || parseFloat(formData.purchasingPrice) <= 0) {
      newErrors.purchasingPrice = 'Valid purchase price is required';
    }
    if (!formData.settingPrice.trim() || parseFloat(formData.settingPrice) <= 0) {
      newErrors.settingPrice = 'Valid setting price is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave({
        batchNo: formData.batchNo.trim(),
        supplier: formData.supplier.trim(),
        quantity: parseFloat(formData.quantity),
        purchaseDate: formData.purchaseDate,
        expiryDate: formData.expiryDate,
        purchasingPrice: parseFloat(formData.purchasingPrice),
        settingPrice: parseFloat(formData.settingPrice)
      });
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      batchNo: '',
      supplier: '',
      quantity: '',
      purchaseDate: '',
      expiryDate: '',
      purchasingPrice: '',
      settingPrice: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay" onClick={handleCancel}></div>

      {/* Modal Card */}
      <div className="modal-card add-batch-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button (X) */}
        <button className="close-btn" onClick={handleCancel}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Title */}
        <h2 className="modal-title">New {medicineName} Batch Entry</h2>
        <p className="modal-description">
          Register a new batch with supplier, quantity, dates, and pricing information.
        </p>

        {/* Form */}
        <form className="batch-form" onSubmit={handleSave}>
          {/* Batch No & Supplier */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Batch No.:</label>
              <input
                type="text"
                name="batchNo"
                value={formData.batchNo}
                onChange={handleInputChange}
                className={`form-input ${errors.batchNo ? 'error' : ''}`}
                placeholder="Enter batch number"
              />
              {errors.batchNo && <span className="error-message">{errors.batchNo}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Supplier:</label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                className={`form-input ${errors.supplier ? 'error' : ''}`}
                placeholder="Enter supplier name"
              />
              {errors.supplier && <span className="error-message">{errors.supplier}</span>}
            </div>
          </div>

          {/* Quantity & Purchase Date */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className={`form-input ${errors.quantity ? 'error' : ''}`}
                placeholder="Enter quantity"
                min="1"
                step="1"
              />
              {errors.quantity && <span className="error-message">{errors.quantity}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Purchase Date:</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleInputChange}
                className={`form-input ${errors.purchaseDate ? 'error' : ''}`}
              />
              {errors.purchaseDate && <span className="error-message">{errors.purchaseDate}</span>}
            </div>
          </div>

          {/* Expiry Date & Purchase Price */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Expiry Date:</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className={`form-input ${errors.expiryDate ? 'error' : ''}`}
              />
              {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Purchase Price:</label>
              <input
                type="number"
                name="purchasingPrice"
                value={formData.purchasingPrice}
                onChange={handleInputChange}
                className={`form-input ${errors.purchasingPrice ? 'error' : ''}`}
                placeholder="Enter purchase price"
                min="0"
                step="0.01"
              />
              {errors.purchasingPrice && <span className="error-message">{errors.purchasingPrice}</span>}
            </div>
          </div>

          {/* Setting Price */}
          <div className="form-group">
            <label className="form-label">Setting Price:</label>
            <input
              type="number"
              name="settingPrice"
              value={formData.settingPrice}
              onChange={handleInputChange}
              className={`form-input ${errors.settingPrice ? 'error' : ''}`}
              placeholder="Enter setting price"
              min="0"
              step="0.01"
            />
            {errors.settingPrice && <span className="error-message">{errors.settingPrice}</span>}
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="">
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddBatchModal;
