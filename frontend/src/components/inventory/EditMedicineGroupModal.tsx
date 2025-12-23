import React, { useState, useEffect } from 'react';
import '../../assets/style/inventory/editMedicineGroupModal.css';

interface EditMedicineGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groupId: string, groupName: string) => Promise<void> | void;
  groupId: string;
  currentName: string;
}

const EditMedicineGroupModal: React.FC<EditMedicineGroupModalProps> = ({
  isOpen,
  onClose,
  onSave,
  groupId,
  currentName
}) => {
  const [groupName, setGroupName] = useState(currentName);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setGroupName(currentName);
      setError('');
      setIsSaving(false);
    }
  }, [isOpen, currentName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    if (isSaving) return;

    try {
      setIsSaving(true);
      await onSave(groupId, groupName.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update group');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setGroupName(currentName);
    setError('');
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

        <h2 className="modal-title">Edit Medicine Group</h2>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="groupName" className="form-label">
              Group Name:
            </label>
            <input
              type="text"
              id="groupName"
              className={`form-input ${error ? 'error' : ''}`}
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                setError('');
              }}
              placeholder="Enter group name"
              autoFocus
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditMedicineGroupModal;









