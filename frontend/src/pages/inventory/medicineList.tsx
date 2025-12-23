import React, { useState, useEffect } from 'react';
import '../../assets/style/inventory/medicineList.css';
// import MedicineStatus from '../../components/ui/medicineStatus';
import BarCodeScanner from '../../components/inventory/BarCodeScanner';
import AddNewMedicineModal from '../../components/inventory/AddNewMedicineModal';
import EditMedicineModal from '../../components/inventory/EditMedicineModal';
import MedicineDetail from './medicineDetail';
import InventoryBar from '../../components/layout/inventoryBar';
// import { inventoryService } from '../../services/api/inventoryService';
import { inventoryService } from '../../services/api/inventoryService';


interface MedicineListProps {
  groupName: string;
  groupId: string;
  onBack: () => void;
  onMedicineAdded?: () => void; // Callback to refresh parent groups
  initialMedicineId?: string; // Medicine ID to auto-select when component loads
  onInitialMedicineSelected?: () => void; // Callback when initial medicine is selected
}

interface Medicine {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  barcode?: number;
  barcode_value?: string;
  barcode_image?: string;
  group_medicine_id?: any;
}

const MedicineList: React.FC<MedicineListProps> = ({ groupName, groupId, onBack, onMedicineAdded, initialMedicineId, onInitialMedicineSelected }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState(false);
  const [isEditMedicineModalOpen, setIsEditMedicineModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<{ id: string; name: string } | null>(null);
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch medicines from API when groupId or searchTerm changes
  useEffect(() => {
    loadMedicines();
  }, [groupId, searchTerm]);

  // Auto-select medicine if initialMedicineId is provided
  useEffect(() => {
    if (initialMedicineId && medicines.length > 0 && !selectedMedicine) {
      const medicine = medicines.find(m => (m._id || m.id) === initialMedicineId);
      if (medicine) {
        setSelectedMedicine({ id: medicine._id || medicine.id || '', name: medicine.name });
        if (onInitialMedicineSelected) {
          onInitialMedicineSelected();
        }
      }
    }
  }, [initialMedicineId, medicines, onInitialMedicineSelected, selectedMedicine]);

  const loadMedicines = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await inventoryService.getMedicinesByGroupId(groupId, searchTerm || undefined);
      setMedicines(data);
    } catch (err: any) {
      console.error('Failed to load medicines:', err);
      setError(err.message || 'Failed to load medicines');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanBarcode = () => {
    setIsScannerOpen(true);
  };

  const handleScanSuccess = (data: { medicineId: string; medicineName: string; groupId: string }) => {
    console.log('Scanned medicine:', data);
    // Navigate directly to medicine detail page
    setSelectedMedicine({ id: data.medicineId, name: data.medicineName });
  };

  const handleCloseScanner = () => {
    setIsScannerOpen(false);
  };

  const handleAddNewMedicine = () => {
    setIsAddMedicineModalOpen(true);
  };

  const handleSaveMedicine = async (medicine: Medicine) => {
    try {
      await loadMedicines(); // Reload medicines to get updated counts
      setIsAddMedicineModalOpen(false);
      // Notify parent to refresh medicine groups (to update totalMedicines count)
      if (onMedicineAdded) {
        onMedicineAdded();
      }
    } catch (err: any) {
      console.error('Error refreshing medicines:', err);
      alert('Medicine created but failed to refresh list');
    }
  };

  const handleCloseAddMedicineModal = () => {
    setIsAddMedicineModalOpen(false);
  };

  const handleEditMedicine = (medicineId: string) => {
    setEditingMedicineId(medicineId);
    setIsEditMedicineModalOpen(true);
  };

  // Helper to get medicine ID
  const getMedicineId = (medicine: Medicine): string => {
    return medicine._id || medicine.id || '';
  };

  const handleSaveEditMedicine = async (medicineData: {
    id: string;
    name: string;
    group: string;
    description: string;
    barcode_image?: File;
    photo?: File;
  }) => {
    try {
      await inventoryService.updateMedicine(medicineData.id, {
        name: medicineData.name,
        description: medicineData.description,
        barcode_image: medicineData.barcode_image,
        photo: medicineData.photo,
      });
      await loadMedicines(); // Reload medicines
      setIsEditMedicineModalOpen(false);
      setEditingMedicineId(null);
    } catch (err: any) {
      console.error('Error updating medicine:', err);
      alert(err.message || 'Failed to update medicine');
    }
  };

  const handleCloseEditMedicineModal = () => {
    setIsEditMedicineModalOpen(false);
    setEditingMedicineId(null);
  };

  const handleDeleteMedicine = async (medicineId: string) => {
    if (window.confirm('Are you sure you want to delete this medicine? This action cannot be undone.')) {
      try {
        await inventoryService.deleteMedicine(medicineId);
        await loadMedicines(); // Reload medicines
      } catch (err: any) {
        console.error('Error deleting medicine:', err);
        alert(err.message || 'Failed to delete medicine');
      }
    }
  };

  const handleDetailClick = (medicineId: string) => {
    const medicine = medicines.find(m => m._id === medicineId || m.id === medicineId);
    if (medicine) {
      setSelectedMedicine({ id: medicine._id || medicine.id || '', name: medicine.name });
    }
  };

  const handleBackFromDetail = () => {
    setSelectedMedicine(null);
  };

  // Show medicine detail page if a medicine is selected
  if (selectedMedicine) {
    return (
      <MedicineDetail
        medicineId={selectedMedicine.id}
        medicineName={selectedMedicine.name}
        onBack={handleBackFromDetail}
      />
    );
  }

  return (
    <div className="medicine-list-container">
      {/* Inventory Bar */}
      <InventoryBar
        showBackButton={true}
        onBack={onBack}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Section Header with Actions */}
      <div className="section-header">
        <h2 className="section-title">Available Medicine in {groupName} Group</h2>
        <div className="section-actions">
          <button className="action-btn-primary" onClick={handleScanBarcode}>
            Scan Bar Code
          </button>
          <button className="action-btn-primary" onClick={handleAddNewMedicine}>
            <span className="plus-icon">+</span>
            Add New Medicine
          </button>
        </div>
      </div>

      {/* Medicine Table */}
      <div className="table-wrapper">
        {error && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#fee', 
            color: '#c33', 
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            Error: {error}
            <button 
              onClick={loadMedicines}
              style={{ 
                marginLeft: '10px', 
                padding: '4px 8px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            Loading medicines...
          </div>
        ) : (
          <table className="medicine-table">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Description</th>
                <th>Barcode</th>
                <th>Actions</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {medicines.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                    No medicines found. Click "Add New Medicine" to create one.
                  </td>
                </tr>
              ) : (
                medicines.map((medicine, index) => {
                  const medicineId = medicine._id || medicine.id || '';
                  return (
                    <tr key={medicineId} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                      <td className="medicine-name">{medicine.name}</td>
                      <td className="medicine-description">{medicine.description || '-'}</td>
                      <td className="medicine-barcode">
                        {medicine.barcode_value || medicine.barcode || '-'}
                      </td>
                      <td className="actions-cell">
                        <button
                          className="action-link edit-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditMedicine(medicineId);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="action-link delete-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMedicine(medicineId);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                      <td className="detail-cell">
                        <button
                          className="detail-link"
                          onClick={() => handleDetailClick(medicineId)}
                        >
                          Detail....
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Barcode Scanner Modal */}
      <BarCodeScanner
        isOpen={isScannerOpen}
        onClose={handleCloseScanner}
        onScanSuccess={handleScanSuccess}
      />

      {/* Add New Medicine Modal */}
      <AddNewMedicineModal
        isOpen={isAddMedicineModalOpen}
        onClose={handleCloseAddMedicineModal}
        onSave={handleSaveMedicine}
        groupName={groupName}
        groupId={groupId}
      />

      {/* Edit Medicine Modal */}
      {editingMedicineId && (() => {
        const medicine = medicines.find(m => (m._id || m.id) === editingMedicineId);
        return medicine ? (
          <EditMedicineModal
            isOpen={isEditMedicineModalOpen}
            onClose={handleCloseEditMedicineModal}
            onSave={handleSaveEditMedicine}
            medicineId={editingMedicineId}
            currentName={medicine.name}
            currentGroup={groupName}
            currentDescription={medicine.description || ''}
          />
        ) : null;
      })()}
    </div>
  );
};

export default MedicineList;

