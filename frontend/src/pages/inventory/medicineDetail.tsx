import React, { useState, useEffect } from 'react';
import '../../assets/style/inventory/medicineDetail.css';
import BatchesTable from '../../components/inventory/BatchesTable';
import BatchDetailModal from '../../components/inventory/BatchDetailModal';
import AddBatchModal from '../../components/inventory/AddBatchModal';
import EditBatchModal from '../../components/inventory/EditBatchModal';
import InventoryBar from '../../components/layout/inventoryBar';
// import { inventoryService } from '../../services/api/inventoryService';
import { inventoryService } from '../../services/api/inventoryService';
import type { Batch } from '../../pages/inventory/data/inventoryData';

interface MedicineDetailProps {
  medicineId: string;
  medicineName: string;
  onBack: () => void;
}

const MedicineDetail: React.FC<MedicineDetailProps> = ({
  medicineId,
  medicineName,
  onBack
  }) => {
  const [isBatchesOpen, setIsBatchesOpen] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);
  const [isEditBatchModalOpen, setIsEditBatchModalOpen] = useState(false);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [batchDetails, setBatchDetails] = useState<{ [key: string]: any }>({});
  const [medicineData, setMedicineData] = useState({
    id: medicineId,
    name: medicineName,
    group: 'Unknown',
    description: {} as { genericName?: string },
    stock: { total: 0, batches: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load medicine and batches from API
  useEffect(() => {
    loadMedicineData();
  }, [medicineId]);

  const loadMedicineData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load medicine details
      const medicine = await inventoryService.getMedicineById(medicineId);
      if (medicine) {
        // Helper function to check if a value is a placeholder
        const isPlaceholder = (value: string | null | undefined): boolean => {
          if (!value) return true;
          const lowerValue = value.toLowerCase().trim();
          const placeholders = ['n/a', 'na', 'none', 'null', 'undefined', 'yahoooo', '-', ''];
          return placeholders.includes(lowerValue);
        };

        // Only include description if it has a real value
        const description: any = {};
        if (medicine.description && !isPlaceholder(medicine.description)) {
          description.genericName = medicine.description;
        }

        setMedicineData({
          id: medicine._id || medicine.id || medicineId,
          name: medicine.name || medicineName,
          group: medicine.group_medicine_id?.group_name || 'Unknown',
          description,
          stock: medicine.stock || { total: 0, batches: 0 }
        });
      }
      
      // Load batches
      const batchesData = await inventoryService.getBatchesByMedicine(medicineId);
      setBatches(batchesData);
      
      // Convert batches to batch details format
    const details: { [key: string]: any } = {};
      batchesData.forEach((batch: any) => {
        details[batch.id] = {
          batchNo: batch.supplier ? `BATCH-${batch.id.slice(-6)}` : `BATCH-${batch.id.slice(-6)}`,
          supplier: batch.supplier || 'Unknown',
          quantity: batch.quantity || 0,
          purchaseDate: batch.purchase_date || '',
          expiryDate: batch.expiry_date || '',
          purchasingPrice: batch.purchase_price || 0,
          settingPrice: batch.setting_price || 0,
          priceUnit: 'Unit'
        };
    });
    setBatchDetails(details);
    } catch (err: any) {
      console.error('Failed to load medicine data:', err);
      setError(err.message || 'Failed to load medicine data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStock = () => {
    setIsAddBatchModalOpen(true);
  };

  const handleSaveBatch = async (batchData: {
    batchNo: string;
    supplier: string;
    quantity: number;
    purchaseDate: string;
    expiryDate: string;
    purchasingPrice: number;
    settingPrice: number;
  }) => {
    try {
      setError(null);
      const newBatch = await inventoryService.createBatch({
        medicine_id: medicineId,
      supplier: batchData.supplier,
      quantity: batchData.quantity,
        purchase_date: batchData.purchaseDate,
        expiry_date: batchData.expiryDate,
        purchase_price: batchData.purchasingPrice,
        setting_price: batchData.settingPrice,
      });
      
      // Reload medicine data to get updated stock
      await loadMedicineData();
      setIsAddBatchModalOpen(false);
    } catch (err: any) {
      console.error('Error creating batch:', err);
      setError(err.message || 'Failed to create batch');
      alert(err.message || 'Failed to create batch');
    }
  };

  const handleCloseAddBatchModal = () => {
    setIsAddBatchModalOpen(false);
  };

  const handleBatchesClick = () => {
    setIsBatchesOpen(!isBatchesOpen);
  };

  const handleBatchDetailClick = (batchId: string) => {
    setSelectedBatchId(batchId);
  };

  const handleCloseBatchDetail = () => {
    setSelectedBatchId(null);
  };

  const handleEditBatch = () => {
    setIsEditBatchModalOpen(true);
  };

  const handleSaveEditBatch = async (batchId: string, batchData: {
    batchNo: string;
    supplier: string;
    quantity: number;
    purchaseDate: string;
    expiryDate: string;
    purchasingPrice: number;
    settingPrice: number;
  }) => {
    try {
      setError(null);
      await inventoryService.updateBatch(batchId, {
          supplier: batchData.supplier,
          quantity: batchData.quantity,
        purchase_date: batchData.purchaseDate,
        expiry_date: batchData.expiryDate,
        purchase_price: batchData.purchasingPrice,
        setting_price: batchData.settingPrice,
      });
      
      // Reload medicine data to get updated stock
      await loadMedicineData();
    setIsEditBatchModalOpen(false);
    handleCloseBatchDetail();
    } catch (err: any) {
      console.error('Error updating batch:', err);
      setError(err.message || 'Failed to update batch');
      alert(err.message || 'Failed to update batch');
    }
  };

  const handleCloseEditBatchModal = () => {
    setIsEditBatchModalOpen(false);
  };

  const handleDeleteBatch = async () => {
    if (selectedBatchId) {
      if (window.confirm('Are you sure you want to delete this batch? This action cannot be undone.')) {
        try {
          setError(null);
          await inventoryService.deleteBatch(selectedBatchId);
          
          // Reload medicine data to get updated stock
          await loadMedicineData();
          handleCloseBatchDetail();
        } catch (err: any) {
          console.error('Error deleting batch:', err);
          setError(err.message || 'Failed to delete batch');
          alert(err.message || 'Failed to delete batch');
        }
      }
    }
  };

  // Get batch detail from state
  const selectedBatchDetail = selectedBatchId ? batchDetails[selectedBatchId] : null;

  return (
    <div className="medicine-detail-container">
      {/* Inventory Bar */}
      <InventoryBar
        showBackButton={true}
        onBack={onBack}
        showSearchBar={false}
      />

      {/* Medicine Name and Add Stock Button */}
      <div className="medicine-header">
        <h2 className="medicine-name">{medicineData.name}</h2>
        <button className="add-stock-btn" onClick={handleAddStock}>
          <span className="plus-icon">+</span>
          Add Stock
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#fee', 
          color: '#c33', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          Error: {error}
        </div>
      )}

      {isLoading && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Loading medicine data...
        </div>
      )}

      {/* Medicine Detail Card */}
      <div className="detail-card">
        {/* Group */}
        <div className="detail-section group-section">
          <span className="detail-label">Group:</span>
          <span className="detail-value group-value">{medicineData.group}</span>
        </div>

        {/* Description - Only show if there's actual content */}
        {Object.keys(medicineData.description).length > 0 && (
        <div className="detail-section description-section">
          <div className="section-label">Description:</div>
          <div className="description-content">
              {medicineData.description.genericName && (
            <div className="description-item">
                  <span className="desc-label">Description:</span>
              <span className="desc-value">{medicineData.description.genericName}</span>
            </div>
              )}
            </div>
          </div>
        )}

        {/* Stock */}
        <div className="detail-section stock-section">
          <div className="section-label">Stock:</div>
          <div className="stock-content">
            <div className="stock-item">
              <span className="stock-label">Total:</span>
              <span className="stock-value">{medicineData.stock.total} units</span>
            </div>
            <div className="batches-item" onClick={handleBatchesClick}>
              <span className="batches-count">{medicineData.stock.batches} Batches</span>
              <div className="batches-icons">
                <span className="warning-icon">⚠️</span>
                <svg 
                  className={`dropdown-arrow ${isBatchesOpen ? 'open' : ''}`} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
            {isBatchesOpen && (
              <BatchesTable
                batches={batches}
                onDetailClick={handleBatchDetailClick}
              />
            )}
          </div>
        </div>
      </div>

      {/* Batch Detail Modal */}
      {selectedBatchDetail && (
        <BatchDetailModal
          isOpen={selectedBatchId !== null && !isEditBatchModalOpen}
          onClose={handleCloseBatchDetail}
          batchDetail={selectedBatchDetail}
          onEdit={handleEditBatch}
          onDelete={handleDeleteBatch}
        />
      )}

      {/* Edit Batch Modal */}
      {selectedBatchId && selectedBatchDetail && (
        <EditBatchModal
          isOpen={isEditBatchModalOpen}
          onClose={handleCloseEditBatchModal}
          onSave={handleSaveEditBatch}
          batchId={selectedBatchId}
          batchDetail={selectedBatchDetail}
        />
      )}

      {/* Add Batch Modal */}
      <AddBatchModal
        isOpen={isAddBatchModalOpen}
        onClose={handleCloseAddBatchModal}
        onSave={handleSaveBatch}
        medicineName={medicineData.name}
      />
    </div>
  );
};

export default MedicineDetail;

