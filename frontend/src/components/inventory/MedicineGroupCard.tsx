import React from 'react';
import '../../assets/style/inventory/medicineGroupCard.css';

interface Medicine {
  name: string;
  dosage?: string;
}

interface MedicineGroupCardProps {
  title: string;
  totalMedicines: number;
  totalStocks: number;
  medicines: Medicine[];
  onEdit: (e?: React.MouseEvent) => void;
  onDelete: (e?: React.MouseEvent) => void;
}

const MedicineGroupCard: React.FC<MedicineGroupCardProps> = ({
  title,
  totalMedicines,
  totalStocks,
  medicines,
  onEdit,
  onDelete
}) => {
  const displayMedicines = medicines.slice(0, 2);
  const hasMore = medicines.length > 2;

  return (
    <div className="medicine-group-card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      
      <div className="card-summary">
        <div className="summary-item">
          <span className="summary-label">Total Medicines:</span>
          <span className="summary-value">{totalMedicines}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Stocks:</span>
          <span className="summary-value">{totalStocks} units</span>
        </div>
      </div>

      <div className="card-medicines">
        <div className="medicines-label">Medicines:</div>
        <div className="medicines-list">
          {displayMedicines.map((medicine, index) => (
            <div key={index} className="medicine-item">
              {medicine.name} {medicine.dosage && `${medicine.dosage}`}
            </div>
          ))}
          {hasMore && (
            <div className="medicine-item more-text">More....</div>
          )}
        </div>
      </div>

      <div className="card-actions" onClick={(e) => e.stopPropagation()}>
        <button className="action-btn edit-btn" onClick={onEdit}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Edit
        </button>
        <button className="action-btn delete-btn" onClick={onDelete}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
};

export default MedicineGroupCard;

