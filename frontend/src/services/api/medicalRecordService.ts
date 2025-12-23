import { apiClient } from './apiClient'

export interface MedicalRecord {
  _id?: string
  id?: string
  recordId: string
  patient: {
    name: string
    id: string
    gender: 'Female' | 'Male' | 'Other'
    dateOfBirth: string
    age: number
    address?: string
    contactNumber?: string
  }
  visit: {
    dateOfVisit: string
    doctor: string
    reasonOfVisit?: string
  }
  medicalHistory: {
    allergiesStatus: 'no-known' | 'has-allergies'
    allergiesDetails?: string
    currentMedications?: string
    chronicDiseases: string[]
    chronicDiseasesDetails?: string
    pastSurgeries?: string
    familyHistories?: string
  }
  vitalSigns: {
    height: number
    heightUnit: 'cm' | 'in'
    weight: number
    weightUnit: 'kg' | 'lb'
    bloodPressure?: string
    pulseRate?: number
    temperature?: number
    respiratoryRate?: number
    oxygenSaturation?: number
    bmi?: number
  }
  physicalExamination?: {
    generalAppearance?: string
    cardiovascular?: string
    respiratory?: string
    abdominal?: string
    neurological?: string
    additionalFindings?: string
  }
  diagnosis?: {
    diagnosis?: string
    testsOrdered?: string
  }
  treatmentPlan?: {
    medicationsPrescribed?: string
    proceduresPerformed?: string
    instruction?: string
  }
  status: 'Completed' | 'Daft'
  createdAt?: string
  updatedAt?: string
}

export const medicalRecordService = {
  async getAll(search?: string, status?: 'Completed' | 'Daft'): Promise<MedicalRecord[]> {
    const params: any = {}
    if (search) params.search = search
    if (status) params.status = status
    
    const records = await apiClient.get<MedicalRecord[]>('/medical-records', params)
    return records
  },

  async getById(id: string): Promise<MedicalRecord> {
    const record = await apiClient.get<MedicalRecord>(`/medical-records/${id}`)
    return record
  },

  async getByRecordId(recordId: string): Promise<MedicalRecord> {
    const record = await apiClient.get<MedicalRecord>(`/medical-records/record-id/${recordId}`)
    return record
  },

  async create(record: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const newRecord = await apiClient.post<MedicalRecord>('/medical-records', record)
    return newRecord
  },

  async update(id: string, record: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const updatedRecord = await apiClient.put<MedicalRecord>(`/medical-records/${id}`, record)
    return updatedRecord
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<void>(`/medical-records/${id}`)
  }
}

