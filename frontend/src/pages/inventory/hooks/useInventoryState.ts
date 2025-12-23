import { useState, useCallback } from 'react';
import type { MedicineListItem, MedicineDetailData, Batch, BatchDetail } from '../data/inventoryData';
import { 
  getMedicinesByGroup, 
  getMedicineDetail, 
  getBatchesByMedicine, 
  getBatchDetail 
} from '../data/inventoryData';

// State management hook for inventory
export const useInventoryState = () => {
  // Medicines state by group
  const [medicinesState, setMedicinesState] = useState<{ [key: string]: MedicineListItem[] }>({});
  
  // Medicine details state
  const [medicineDetailsState, setMedicineDetailsState] = useState<{ [key: string]: MedicineDetailData }>({});
  
  // Batches state by medicine
  const [batchesState, setBatchesState] = useState<{ [key: string]: Batch[] }>({});
  
  // Batch details state
  const [batchDetailsState, setBatchDetailsState] = useState<{ [key: string]: BatchDetail }>({});

  // Initialize medicines for a group
  const initializeMedicines = useCallback((groupName: string) => {
    if (!medicinesState[groupName]) {
      const medicines = getMedicinesByGroup(groupName);
      setMedicinesState(prev => ({ ...prev, [groupName]: medicines }));
    }
  }, [medicinesState]);

  // Get medicines for a group
  const getMedicines = useCallback((groupName: string): MedicineListItem[] => {
    if (!medicinesState[groupName]) {
      initializeMedicines(groupName);
      return getMedicinesByGroup(groupName);
    }
    return medicinesState[groupName];
  }, [medicinesState, initializeMedicines]);

  // Add medicine
  const addMedicine = useCallback((groupName: string, medicine: MedicineListItem) => {
    setMedicinesState(prev => ({
      ...prev,
      [groupName]: [...(prev[groupName] || []), medicine]
    }));
  }, []);

  // Update medicine
  const updateMedicine = useCallback((groupName: string, medicineId: string, updates: Partial<MedicineListItem>) => {
    setMedicinesState(prev => ({
      ...prev,
      [groupName]: (prev[groupName] || []).map(med =>
        med.id === medicineId ? { ...med, ...updates } : med
      )
    }));
  }, []);

  // Delete medicine
  const deleteMedicine = useCallback((groupName: string, medicineId: string) => {
    setMedicinesState(prev => ({
      ...prev,
      [groupName]: (prev[groupName] || []).filter(med => med.id !== medicineId)
    }));
  }, []);

  // Get medicine detail
  const getMedicineDetailData = useCallback((medicineId: string): MedicineDetailData | null => {
    if (medicineDetailsState[medicineId]) {
      return medicineDetailsState[medicineId];
    }
    const detail = getMedicineDetail(medicineId);
    if (detail) {
      setMedicineDetailsState(prev => ({ ...prev, [medicineId]: detail }));
    }
    return detail;
  }, [medicineDetailsState]);

  // Update medicine detail
  const updateMedicineDetail = useCallback((medicineId: string, updates: Partial<MedicineDetailData>) => {
    setMedicineDetailsState(prev => ({
      ...prev,
      [medicineId]: { ...(prev[medicineId] || getMedicineDetail(medicineId) || {} as MedicineDetailData), ...updates }
    }));
  }, []);

  // Get batches for medicine
  const getBatches = useCallback((medicineId: string): Batch[] => {
    if (!batchesState[medicineId]) {
      const batches = getBatchesByMedicine(medicineId);
      setBatchesState(prev => ({ ...prev, [medicineId]: batches }));
      return batches;
    }
    return batchesState[medicineId];
  }, [batchesState]);

  // Add batch
  const addBatch = useCallback((medicineId: string, batch: Batch, batchDetail: BatchDetail) => {
    setBatchesState(prev => ({
      ...prev,
      [medicineId]: [...(prev[medicineId] || []), batch]
    }));
    setBatchDetailsState(prev => ({
      ...prev,
      [batch.id]: batchDetail
    }));
    // Update medicine detail stock
    updateMedicineDetail(medicineId, {
      stock: {
        total: (getMedicineDetailData(medicineId)?.stock.total || 0) + batch.qty,
        batches: (getBatches(medicineId).length + 1)
      }
    });
  }, [updateMedicineDetail, getMedicineDetailData, getBatches]);

  // Update batch
  const updateBatch = useCallback((medicineId: string, batchId: string, batch: Partial<Batch>, batchDetail: Partial<BatchDetail>) => {
    setBatchesState(prev => ({
      ...prev,
      [medicineId]: (prev[medicineId] || []).map(b =>
        b.id === batchId ? { ...b, ...batch } : b
      )
    }));
    if (Object.keys(batchDetail).length > 0) {
      setBatchDetailsState(prev => ({
        ...prev,
        [batchId]: { ...(prev[batchId] || getBatchDetail(batchId) || {} as BatchDetail), ...batchDetail }
      }));
    }
  }, []);

  // Delete batch
  const deleteBatch = useCallback((medicineId: string, batchId: string) => {
    const batch = batchesState[medicineId]?.find(b => b.id === batchId);
    setBatchesState(prev => ({
      ...prev,
      [medicineId]: (prev[medicineId] || []).filter(b => b.id !== batchId)
    }));
    setBatchDetailsState(prev => {
      const newState = { ...prev };
      delete newState[batchId];
      return newState;
    });
    // Update medicine detail stock
    if (batch) {
      updateMedicineDetail(medicineId, {
        stock: {
          total: Math.max(0, (getMedicineDetailData(medicineId)?.stock.total || 0) - batch.qty),
          batches: Math.max(0, (getBatches(medicineId).length - 1))
        }
      });
    }
  }, [batchesState, updateMedicineDetail, getMedicineDetailData, getBatches]);

  // Get batch detail
  const getBatchDetailData = useCallback((batchId: string): BatchDetail | null => {
    if (batchDetailsState[batchId]) {
      return batchDetailsState[batchId];
    }
    const detail = getBatchDetail(batchId);
    if (detail) {
      setBatchDetailsState(prev => ({ ...prev, [batchId]: detail }));
    }
    return detail;
  }, [batchDetailsState]);

  return {
    getMedicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    getMedicineDetailData,
    updateMedicineDetail,
    getBatches,
    addBatch,
    updateBatch,
    deleteBatch,
    getBatchDetailData
  };
};









