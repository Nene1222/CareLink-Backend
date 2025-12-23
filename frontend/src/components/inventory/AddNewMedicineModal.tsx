import React, { useState } from 'react';
import '../../assets/style/inventory/addNewMedicineModal.css';
import { inventoryService } from '../../services/api/inventoryService';
interface AddNewMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medicine: any) => void;
  groupName?: string;
  groupId?: string;
}

const AddNewMedicineModal: React.FC<AddNewMedicineModalProps> = ({
  isOpen,
  onClose,
  onSave,
  groupName = '',
  groupId
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    barcode_image: null as File | null,
    photo: null as File | null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'barcode_image') => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Medicine name is required');
      return;
    }
    if (!groupId) {
      setError('Group ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const medicine = await inventoryService.createMedicine({
        group_medicine_id: groupId,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        barcode_image: formData.barcode_image || undefined,
        photo: formData.photo || undefined,
      });
      onSave(medicine);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        barcode_image: null,
        photo: null
      });
      onClose();
    } catch (err: any) {
      console.error('Error creating medicine:', err);
      setError(err.message || 'Failed to create medicine');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      barcode_image: null,
      photo: null
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay" onClick={handleCancel}></div>

      {/* Modal Card */}
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">New Medicine Registration</h2>
        
        {error && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#fee', 
            color: '#c33', 
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Medicine Group (Read-only) */}
          {groupName && (
            <div className="form-group">
              <label htmlFor="group" className="form-label">
                Medicine Group:
              </label>
              <input
                type="text"
                id="group"
                name="group"
                className="form-input"
                value={groupName}
                disabled
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              />
            </div>
          )}

          {/* Medicine Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Medicine Name: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter medicine name"
              required
              autoFocus
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter medicine description"
              rows={4}
              disabled={isLoading}
            />
          </div>

          {/* Bar Code Image */}
          <div className="form-group">
            <label htmlFor="barcode_image" className="form-label">
              Bar Code Image:
            </label>
            <div className="file-upload-wrapper">
            <input
                type="file"
                id="barcode_image"
                name="barcode_image"
                className="file-input"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'barcode_image')}
              disabled={isLoading}
            />
              <label htmlFor="barcode_image" className="file-upload-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                {formData.barcode_image ? formData.barcode_image.name : 'Upload barcode image'}
              </label>
            </div>
          </div>

          {/* Photo */}
          <div className="form-group">
            <label htmlFor="photo" className="form-label">
              Photo:
            </label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="photo"
                name="photo"
                className="file-input"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'photo')}
              />
              <label htmlFor="photo" className="file-upload-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                {formData.photo ? formData.photo.name : 'Upload photo'}
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={!formData.name.trim() || isLoading || !groupId}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddNewMedicineModal;

