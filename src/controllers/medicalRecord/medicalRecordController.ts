import { Request, Response } from 'express'
import { MedicalRecord } from '../../models/medical/medicalRecord'

export class MedicalRecordController {
  // GET /medical-records
  async getAll(req: Request, res: Response) {
    try {
      const { search, status } = req.query
      
      let query: any = { deleted_at: null }
      
      // Filter by status if provided
      if (status && (status === 'Completed' || status === 'Daft')) {
        query.status = status
      }
      
      // Search functionality
      if (search && typeof search === 'string' && search.trim()) {
        query.$or = [
          { recordId: { $regex: search.trim(), $options: 'i' } },
          { 'patient.name': { $regex: search.trim(), $options: 'i' } },
          { 'patient.id': { $regex: search.trim(), $options: 'i' } },
          { 'diagnosis.diagnosis': { $regex: search.trim(), $options: 'i' } },
          { 'visit.doctor': { $regex: search.trim(), $options: 'i' } }
        ]
      }
      
      const records = await MedicalRecord.find(query)
        .sort({ 'visit.dateOfVisit': -1, createdAt: -1 })
        .lean()
      
      return res.json({ data: records })
    } catch (err) {
      console.error('Error fetching medical records', err)
      return res.status(500).json({ error: 'Failed to fetch medical records' })
    }
  }

  // GET /medical-records/:id
  async getById(req: Request, res: Response) {
    try {
      const record = await MedicalRecord.findOne({
        _id: req.params.id,
        deleted_at: null
      }).lean()
      
      if (!record) {
        return res.status(404).json({ error: 'Medical record not found' })
      }
      
      return res.json({ data: record })
    } catch (err) {
      console.error('Error fetching medical record', err)
      return res.status(500).json({ error: 'Failed to fetch medical record' })
    }
  }

  // GET /medical-records/record-id/:recordId
  async getByRecordId(req: Request, res: Response) {
    try {
      const record = await MedicalRecord.findOne({
        recordId: req.params.recordId,
        deleted_at: null
      }).lean()
      
      if (!record) {
        return res.status(404).json({ error: 'Medical record not found' })
      }
      
      return res.json({ data: record })
    } catch (err) {
      console.error('Error fetching medical record', err)
      return res.status(500).json({ error: 'Failed to fetch medical record' })
    }
  }

  // POST /medical-records
  async create(req: Request, res: Response) {
    try {
      const {
        recordId,
        patient,
        visit,
        medicalHistory,
        vitalSigns,
        physicalExamination,
        diagnosis,
        treatmentPlan,
        status
      } = req.body

      // Validate required fields
      if (!recordId || !patient || !visit || !medicalHistory || !vitalSigns) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          missing: {
            recordId: !recordId,
            patient: !patient,
            visit: !visit,
            medicalHistory: !medicalHistory,
            vitalSigns: !vitalSigns
          }
        })
      }

      // Validate nested required fields
      if (!patient.name || !patient.id || !patient.gender || !patient.dateOfBirth || patient.age === undefined) {
        return res.status(400).json({ 
          error: 'Missing required patient fields',
          missing: {
            name: !patient.name,
            id: !patient.id,
            gender: !patient.gender,
            dateOfBirth: !patient.dateOfBirth,
            age: patient.age === undefined
          }
        })
      }

      if (!visit.dateOfVisit || !visit.doctor) {
        return res.status(400).json({ 
          error: 'Missing required visit fields',
          missing: {
            dateOfVisit: !visit.dateOfVisit,
            doctor: !visit.doctor
          }
        })
      }

      if (!medicalHistory.allergiesStatus) {
        return res.status(400).json({ error: 'Missing allergiesStatus in medicalHistory' })
      }

      if (!vitalSigns.height || !vitalSigns.weight || !vitalSigns.heightUnit || !vitalSigns.weightUnit) {
        return res.status(400).json({ 
          error: 'Missing required vital signs fields',
          missing: {
            height: !vitalSigns.height,
            weight: !vitalSigns.weight,
            heightUnit: !vitalSigns.heightUnit,
            weightUnit: !vitalSigns.weightUnit
          }
        })
      }

      // Check if recordId already exists
      const existing = await MedicalRecord.findOne({ recordId, deleted_at: null })
      if (existing) {
        return res.status(400).json({ error: 'Record ID already exists' })
      }

      const record = await MedicalRecord.create({
        recordId,
        patient,
        visit,
        medicalHistory,
        vitalSigns,
        physicalExamination: physicalExamination || {},
        diagnosis: diagnosis || {},
        treatmentPlan: treatmentPlan || {},
        status: status || 'Daft'
      })

      const populatedRecord = await MedicalRecord.findById(record._id).lean()
      return res.status(201).json({ data: populatedRecord })
    } catch (err: any) {
      console.error('Error creating medical record', err)
      console.error('Request body:', JSON.stringify(req.body, null, 2))
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Record ID already exists' })
      }
      // Return more detailed error message
      const errorMessage = err.message || 'Failed to create medical record'
      return res.status(500).json({ 
        error: errorMessage,
        details: err.errors ? Object.keys(err.errors).map(key => `${key}: ${err.errors[key].message}`).join(', ') : undefined
      })
    }
  }

  // PUT /medical-records/:id
  async update(req: Request, res: Response) {
    try {
      const {
        patient,
        visit,
        medicalHistory,
        vitalSigns,
        physicalExamination,
        diagnosis,
        treatmentPlan,
        status
      } = req.body

      const record = await MedicalRecord.findOne({
        _id: req.params.id,
        deleted_at: null
      })

      if (!record) {
        return res.status(404).json({ error: 'Medical record not found' })
      }

      // Update fields
      if (patient) Object.assign(record.patient, patient)
      if (visit) Object.assign(record.visit, visit)
      if (medicalHistory) Object.assign(record.medicalHistory, medicalHistory)
      if (vitalSigns) Object.assign(record.vitalSigns, vitalSigns)
      if (physicalExamination) Object.assign(record.physicalExamination, physicalExamination)
      if (diagnosis) Object.assign(record.diagnosis, diagnosis)
      if (treatmentPlan) Object.assign(record.treatmentPlan, treatmentPlan)
      if (status) record.status = status

      await record.save()
      return res.json({ data: record })
    } catch (err) {
      console.error('Error updating medical record', err)
      return res.status(500).json({ error: 'Failed to update medical record' })
    }
  }

  // DELETE /medical-records/:id
  async delete(req: Request, res: Response) {
    try {
      const record = await MedicalRecord.findOne({
        _id: req.params.id,
        deleted_at: null
      })

      if (!record) {
        return res.status(404).json({ error: 'Medical record not found' })
      }

      // Soft delete
      record.deleted_at = new Date()
      await record.save()

      return res.status(204).send()
    } catch (err) {
      console.error('Error deleting medical record', err)
      return res.status(500).json({ error: 'Failed to delete medical record' })
    }
  }
}

