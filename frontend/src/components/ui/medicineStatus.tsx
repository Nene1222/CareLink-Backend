import React from 'react';
import '../../assets/style/inventory/medicineStatus.css';

interface MedicineStatusProps {
  status: 'Available' | 'Low Stock' | 'Out of Stock';
}

const MedicineStatus: React.FC<MedicineStatusProps> = ({ status }) => {
  return (
    <span className={`medicine-status medicine-status-${status.toLowerCase().replace(' ', '-')}`}>
      {status}
    </span>
  );
};

export default MedicineStatus;

