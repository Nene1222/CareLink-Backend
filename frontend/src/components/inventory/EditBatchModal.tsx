import React, { useState, useEffect } from 'react';
import '../../assets/style/inventory/editBatchModal.css';

interface EditBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (batchId: string, batchData: {
    batchNo: string;
    supplier: string;
    quantity: number;
    purchaseDate: string;
    expiryDate: string;
    purchasingPrice: number;
    settingPrice: number;
  }) => void;
  batchId: string;
  batchDetail: {
    batchNo: string;
    supplier: string;
    quantity: number;
    purchaseDate: string;
    expiryDate: string;
    purchasingPrice: number;
    settingPrice: number;
    priceUnit: string;
  };
}

const EditBatchModal: React.FC<EditBatchModalProps> = ({
  isOpen,
  onClose,
  onSave,
  batchId,
  batchDetail
}) => {
  const [formData, setFormData] = useState({
    batchNo: batchDetail.batchNo,
    supplier: batchDetail.supplier,
    quantity: batchDetail.quantity.toString(),
    purchaseDate: batchDetail.purchaseDate,
    expiryDate: batchDetail.expiryDate,
    purchasingPrice: batchDetail.purchasingPrice.toString(),
    settingPrice: batchDetail.settingPrice.toString()
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        batchNo: batchDetail.batchNo,
        supplier: batchDetail.supplier,
        quantity: batchDetail.quantity.toString(),
        purchaseDate: batchDetail.purchaseDate,
        expiryDate: batchDetail.expiryDate,
        purchasingPrice: batchDetail.purchasingPrice.toString(),
        settingPrice: batchDetail.settingPrice.toString()
      });
      setErrors({});
    }
  }, [isOpen, batchDetail]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      onSave(batchId, {
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
      batchNo: batchDetail.batchNo,
      supplier: batchDetail.supplier,
      quantity: batchDetail.quantity.toString(),
      purchaseDate: batchDetail.purchaseDate,
      expiryDate: batchDetail.expiryDate,
      purchasingPrice: batchDetail.purchasingPrice.toString(),
      settingPrice: batchDetail.settingPrice.toString()
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
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button (X) */}
        <button className="close-btn" onClick={handleCancel}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Title */}
        <h2 className="modal-title">Edit Batch No {batchDetail.batchNo}</h2>

        {/* Form */}
        <form className="batch-form" onSubmit={handleSave}>
          {/* Batch No */}
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

          {/* Supplier */}
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

          {/* Quantity */}
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

          {/* Purchase Date */}
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

          {/* Expiry Date */}
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

          {/* Purchase Price */}
          <div className="form-group">
            <label className="form-label">Purchase Price:</label>
            <div className="price-input-wrapper">
              <input
                type="number"
                name="purchasingPrice"
                value={formData.purchasingPrice}
                onChange={handleInputChange}
                className={`form-input price-input ${errors.purchasingPrice ? 'error' : ''}`}
                placeholder="Enter purchase price"
                min="0"
                step="0.01"
              />
              <span className="price-unit">per {batchDetail.priceUnit}</span>
            </div>
            {errors.purchasingPrice && <span className="error-message">{errors.purchasingPrice}</span>}
          </div>

          {/* Setting Price */}
          <div className="form-group">
            <label className="form-label">Setting Price:</label>
            <div className="price-input-wrapper">
              <input
                type="number"
                name="settingPrice"
                value={formData.settingPrice}
                onChange={handleInputChange}
                className={`form-input price-input ${errors.settingPrice ? 'error' : ''}`}
                placeholder="Enter setting price"
                min="0"
                step="0.01"
              />
              <span className="price-unit">per {batchDetail.priceUnit}</span>
            </div>
            {errors.settingPrice && <span className="error-message">{errors.settingPrice}</span>}
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditBatchModal;









