import React, { useState, useEffect } from 'react';
import '../../assets/style/inventory/inventory.css';
import MedicineGroupCard from '../../components/inventory/MedicineGroupCard';
import BarCodeScanner from '../../components/inventory/BarCodeScanner';
import AddMedicineGroupModal from '../../components/inventory/AddMedicineGroupModal';
import EditMedicineGroupModal from '../../components/inventory/EditMedicineGroupModal';
import MedicineList from './medicineList';
import InventoryBar from '../../components/layout/inventoryBar';
// import { inventoryService } from '../../services/api/inventoryService';
import { inventoryService } from '../../services/api/inventoryService';
import type { MedicineGroup } from '../../pages/inventory/data/inventoryData';



const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  
  // State for medicine groups from API
  const [medicineGroups, setMedicineGroups] = useState<MedicineGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load medicine groups from API on mount and when search changes
  useEffect(() => {
    loadMedicineGroups();
  }, [searchTerm]);

  const loadMedicineGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const groups = await inventoryService.getMedicineGroups(searchTerm || undefined);
      setMedicineGroups(groups);
    } catch (err: any) {
      console.error('Failed to load medicine groups:', err);
      setError(err.message || 'Failed to load medicine groups');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (groupId: string) => {
    setEditingGroupId(groupId);
    setIsEditGroupModalOpen(true);
  };

  const handleSaveEdit = async (groupId: string, newName: string) => {
    try {
      setError(null);
      const updatedGroup = await inventoryService.updateMedicineGroup(groupId, { title: newName });
      setMedicineGroups(prevGroups =>
        prevGroups.map(group =>
          group.id === groupId ? updatedGroup : group
        )
      );
      setIsEditGroupModalOpen(false);
      setEditingGroupId(null);
    } catch (err: any) {
      console.error('Failed to update medicine group:', err);
      alert(err.message || 'Failed to update medicine group');
    }
  };

  const handleCloseEditModal = () => {
    setIsEditGroupModalOpen(false);
    setEditingGroupId(null);
  };

  const handleDelete = async (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this medicine group? This action cannot be undone.')) {
      try {
        setError(null);
        await inventoryService.deleteMedicineGroup(groupId);
        setMedicineGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
      } catch (err: any) {
        console.error('Failed to delete medicine group:', err);
        alert(err.message || 'Failed to delete medicine group');
      }
    }
  };

  const handleScanBarcode = () => {
    setIsScannerOpen(true);
  };

  const [scannedMedicine, setScannedMedicine] = useState<{ medicineId: string; medicineName: string; groupId: string } | null>(null);

  const handleScanSuccess = (data: { medicineId: string; medicineName: string; groupId: string }) => {
    console.log('Scanned medicine:', data);
    // Store scanned medicine and navigate to its group
    setScannedMedicine(data);
    const group = medicineGroups.find(g => g.id === data.groupId);
    if (group) {
      setSelectedGroup(group.title);
      setSelectedGroupId(data.groupId);
    } else {
      alert(`Found medicine: ${data.medicineName}\n\nGroup not found. Please refresh the page.`);
    }
  };

  const handleCloseScanner = () => {
    setIsScannerOpen(false);
  };

  const handleAddGroup = () => {
    setIsAddGroupModalOpen(true);
  };

  const handleSaveGroup = async (groupName: string) => {
    try {
      setError(null);
      const newGroup = await inventoryService.createMedicineGroup(groupName);
      setMedicineGroups([...medicineGroups, newGroup]);
    } catch (err: any) {
      console.error('Failed to create medicine group:', err);
      alert(err.message || 'Failed to create medicine group');
      throw err; // Re-throw to prevent modal from closing on error
    }
  };

  const handleCloseAddGroupModal = () => {
    setIsAddGroupModalOpen(false);
  };

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const handleGroupClick = (groupId: string) => {
    const group = medicineGroups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroup(group.title);
      setSelectedGroupId(groupId);
    }
  };

  const handleBackToList = () => {
    setSelectedGroup(null);
    setSelectedGroupId(null);
  };

  // Show medicine list if a group is selected
  if (selectedGroup && selectedGroupId) {
    return (
      <MedicineList 
        groupName={selectedGroup} 
        groupId={selectedGroupId} 
        onBack={() => {
          setScannedMedicine(null);
          handleBackToList();
        }}
        onMedicineAdded={loadMedicineGroups}
        initialMedicineId={scannedMedicine?.medicineId}
        onInitialMedicineSelected={() => setScannedMedicine(null)}
      />
    );
  }

  return (
    <div className="inventory-container">
      {/* Inventory Bar */}
      <InventoryBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Action Buttons */}
      <div className="actions-bar">
        <button className="action-btn-primary" onClick={handleScanBarcode}>
          Scan Bar Code
        </button>
        <button className="action-btn-primary" onClick={handleAddGroup}>
          <span className="plus-icon">+</span>
          Add Group Medicine
        </button>
      </div>

      {/* Main Content */}
      <div className="content-section">
        <h2 className="section-title">Available Medicine Group</h2>
        
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
              onClick={loadMedicineGroups}
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
            Loading medicine groups...
          </div>
        ) : (
          <div className="medicine-groups-grid">
            {medicineGroups.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                No medicine groups found. Click "Add Group Medicine" to create one.
              </div>
            ) : (
              medicineGroups.map((group) => (
            <div
              key={group.id}
              onClick={() => handleGroupClick(group.id)}
              style={{ cursor: 'pointer' }}
            >
              <MedicineGroupCard
                title={group.title}
                totalMedicines={group.totalMedicines}
                totalStocks={group.totalStocks}
                medicines={group.medicines}
                onEdit={(e) => {
                  e?.stopPropagation();
                  handleEdit(group.id);
                }}
                onDelete={(e) => {
                  e?.stopPropagation();
                  handleDelete(group.id);
                }}
              />
            </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Barcode Scanner Modal */}
      <BarCodeScanner
        isOpen={isScannerOpen}
        onClose={handleCloseScanner}
        onScanSuccess={handleScanSuccess}
      />

      {/* Add Medicine Group Modal */}
      <AddMedicineGroupModal
        isOpen={isAddGroupModalOpen}
        onClose={handleCloseAddGroupModal}
        onSave={handleSaveGroup}
      />

      {/* Edit Medicine Group Modal */}
      {editingGroupId && (
        <EditMedicineGroupModal
          isOpen={isEditGroupModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
          groupId={editingGroupId}
          currentName={medicineGroups.find(g => g.id === editingGroupId)?.title || ''}
        />
      )}
    </div>
  );
};

export default InventoryPage;

