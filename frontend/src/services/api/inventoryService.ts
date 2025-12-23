import { apiClient } from './apiClient'
import type { MedicineGroup } from '../../pages/inventory/data/inventoryData'

// API response type matches backend structure
interface MedicineGroupResponse {
  id: string
  title: string
  totalMedicines: number
  totalStocks: number
  medicines?: Array<{ name: string }>
  createdAt?: string
  updatedAt?: string
}

// Convert API response to frontend MedicineGroup format
const mapApiToMedicineGroup = (apiGroup: MedicineGroupResponse): MedicineGroup => ({
  id: apiGroup.id,
  title: apiGroup.title,
  totalMedicines: apiGroup.totalMedicines || 0,
  totalStocks: apiGroup.totalStocks || 0,
  medicines: apiGroup.medicines || [], // Medicines from backend
})

export const inventoryService = {
  // Medicine Groups
  async getMedicineGroups(search?: string): Promise<MedicineGroup[]> {
    const params = search ? { search } : {}
    const groups = await apiClient.get<MedicineGroupResponse[]>('/medicine-groups', { params })
    return groups.map(mapApiToMedicineGroup)
  },

  async getMedicineGroupById(id: string): Promise<MedicineGroup> {
    const group = await apiClient.get<MedicineGroupResponse>(`/medicine-groups/${id}`)
    return mapApiToMedicineGroup(group)
  },

  async createMedicineGroup(title: string): Promise<MedicineGroup> {
    const group = await apiClient.post<MedicineGroupResponse>('/medicine-groups', {
      title,
      totalMedicines: 0,
      totalStocks: 0,
    })
    return mapApiToMedicineGroup(group)
  },

  async updateMedicineGroup(id: string, data: { title?: string; totalMedicines?: number; totalStocks?: number }): Promise<MedicineGroup> {
    const group = await apiClient.put<MedicineGroupResponse>(`/medicine-groups/${id}`, data)
    return mapApiToMedicineGroup(group)
  },

  async deleteMedicineGroup(id: string): Promise<void> {
    await apiClient.delete<void>(`/medicine-groups/${id}`)
  },

  // Medicines
  async getMedicines(): Promise<any[]> {
    const medicines = await apiClient.get<any[]>('/medicines')
    return medicines
  },

  async getMedicinesByGroupId(groupId: string, search?: string): Promise<any[]> {
    const params = search ? { search } : {}
    const medicines = await apiClient.get<any[]>(`/medicines/group-id/${groupId}`, { params })
    return medicines
  },

  async getMedicinesByGroupName(groupName: string): Promise<any[]> {
    const medicines = await apiClient.get<any[]>(`/medicines/group/${encodeURIComponent(groupName)}`)
    return medicines
  },

  async getMedicineById(id: string): Promise<any> {
    const medicine = await apiClient.get<any>(`/medicines/${id}`)
    return medicine
  },

  async createMedicine(data: {
    group_medicine_id: string
    name: string
    description?: string
    photo?: File
    barcode_image?: File
  }): Promise<any> {
    const formData = new FormData()
    formData.append('group_medicine_id', data.group_medicine_id)
    formData.append('name', data.name)
    if (data.description) {
      formData.append('description', data.description)
    }
    if (data.photo) {
      formData.append('photo', data.photo)
    }
    if (data.barcode_image) {
      formData.append('barcode_image', data.barcode_image)
    }
    
    const medicine = await apiClient.post<any>('/medicines', formData, { isFormData: true })
    return medicine
  },

  async updateMedicine(id: string, data: {
    group_medicine_id?: string
    name?: string
    description?: string
    photo?: File
    barcode_image?: File
  }): Promise<any> {
    const formData = new FormData()
    if (data.group_medicine_id) {
      formData.append('group_medicine_id', data.group_medicine_id)
    }
    if (data.name) {
      formData.append('name', data.name)
    }
    if (data.description) {
      formData.append('description', data.description)
    }
    if (data.photo) {
      formData.append('photo', data.photo)
    }
    if (data.barcode_image) {
      formData.append('barcode_image', data.barcode_image)
    }
    
    const medicine = await apiClient.put<any>(`/medicines/${id}`, formData, { isFormData: true })
    return medicine
  },

  // Barcode Scanning
  async scanBarcode(barcodeImage: File): Promise<{ medicineId: string; medicineName: string; groupId: string }> {
    const formData = new FormData()
    formData.append('barcode_image', barcodeImage)
    
    const result = await apiClient.post<{ medicineId: string; medicineName: string; groupId: string }>('/barcode/scan', formData, { isFormData: true })
    return result
  },

  async deleteMedicine(id: string): Promise<void> {
    await apiClient.delete<void>(`/medicines/${id}`)
  },

  // Batches
  async getBatches(): Promise<any[]> {
    const batches = await apiClient.get<any[]>('/batches')
    return batches
  },

  async getBatchById(id: string): Promise<any> {
    const batch = await apiClient.get<any>(`/batches/${id}`)
    return batch
  },

  async getBatchesByMedicine(medicineId: string): Promise<any[]> {
    const batches = await apiClient.get<any[]>(`/batches/medicines/${medicineId}/batches`)
    return batches
  },

  async createBatch(data: {
    medicine_id: string
    supplier: string
    quantity: number
    purchase_date: string
    expiry_date: string
    purchase_price: number
    setting_price: number
  }): Promise<any> {
    const batch = await apiClient.post<any>('/batches', data)
    return batch
  },

  async updateBatch(id: string, data: {
    supplier?: string
    quantity?: number
    purchase_date?: string
    expiry_date?: string
    purchase_price?: number
    setting_price?: number
  }): Promise<any> {
    const batch = await apiClient.put<any>(`/batches/${id}`, data)
    return batch
  },

  async deleteBatch(id: string): Promise<void> {
    await apiClient.delete<void>(`/batches/${id}`)
  },
}
