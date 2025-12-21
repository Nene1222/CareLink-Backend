import { Request, Response } from 'express'
import { Batch } from '../../models/medical/batch'
import { Medicine } from '../../models/medical/medicine'

// Helper function to calculate expiration status
function getExpirationStatus(expiryDate: Date): {
  status: 'expired' | 'expiring_soon' | 'ok'
  daysUntilExpiry: number
  message: string
} {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return {
      status: 'expired',
      daysUntilExpiry: Math.abs(diffDays),
      message: `Expired ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ago`
    }
  } else if (diffDays <= 30) {
    return {
      status: 'expiring_soon',
      daysUntilExpiry: diffDays,
      message: `Expires in ${diffDays} day${diffDays !== 1 ? 's' : ''}`
    }
  } else {
    return {
      status: 'ok',
      daysUntilExpiry: diffDays,
      message: `Expires in ${diffDays} days`
    }
  }
}

// Helper function to enrich batch with expiration info
function enrichBatch(batch: any) {
  const expirationInfo = getExpirationStatus(batch.expiry_date)
  return {
    id: batch._id.toString(),
    medicine_id: batch.medicine_id.toString(),
    supplier: batch.supplier,
    quantity: batch.quantity,
    purchase_date: batch.purchase_date,
    expiry_date: batch.expiry_date,
    purchase_price: batch.purchase_price,
    setting_price: batch.setting_price,
    expirationStatus: expirationInfo.status,
    expirationMessage: expirationInfo.message,
    daysUntilExpiry: expirationInfo.daysUntilExpiry,
    deleted_at: batch.deleted_at,
    createdAt: batch.createdAt,
    updatedAt: batch.updatedAt,
  }
}

export class BatchController {
  // GET /batches
  async getAll(_req: Request, res: Response) {
    try {
      const batches = await Batch.find({ deleted_at: null }).lean()
      const enrichedBatches = batches.map(batch => enrichBatch(batch))
      return res.json({ data: enrichedBatches })
    } catch (err) {
      console.error('Error fetching batches', err)
      return res.status(500).json({ error: 'Failed to fetch batches' })
    }
  }

  // GET /batches/:id
  async getById(req: Request, res: Response) {
    try {
      const batch = await Batch.findById(req.params.id).lean()
      if (!batch) return res.status(404).json({ error: 'Batch not found' })
      const enrichedBatch = enrichBatch(batch)
      return res.json({ data: enrichedBatch })
    } catch (err) {
      console.error('Error fetching batch', err)
      return res.status(500).json({ error: 'Failed to fetch batch' })
    }
  }

  // GET /medicines/:medicineId/batches
  async getByMedicine(req: Request, res: Response) {
    try {
      const medicine = await Medicine.findById(req.params.medicineId)
      if (!medicine) {
        return res.status(404).json({ error: 'Medicine not found' })
      }
      
      const batches = await Batch.find({
        medicine_id: req.params.medicineId,
        deleted_at: null
      })
        .sort({ expiry_date: 1 }) // Sort by expiry date ascending
        .lean()
      
      const enrichedBatches = batches.map(batch => enrichBatch(batch))
      return res.json({ data: enrichedBatches })
    } catch (err) {
      console.error('Error fetching batches by medicine', err)
      return res.status(500).json({ error: 'Failed to fetch batches by medicine' })
    }
  }

  // POST /batches
  async create(req: Request, res: Response) {
    try {
      const {
        medicine_id,
        supplier,
        quantity,
        purchase_date,
        expiry_date,
        purchase_price,
        setting_price,
      } = req.body

      if (!medicine_id || !supplier || quantity === undefined || !purchase_date || !expiry_date || purchase_price === undefined || setting_price === undefined) {
        return res.status(400).json({
          error: 'medicine_id, supplier, quantity, purchase_date, expiry_date, purchase_price, and setting_price are required'
        })
      }

      // Verify medicine exists
      const medicine = await Medicine.findById(medicine_id)
      if (!medicine) {
        return res.status(400).json({ error: 'Invalid medicine_id' })
      }

      const batch = await Batch.create({
        medicine_id,
        supplier,
        quantity,
        purchase_date: new Date(purchase_date),
        expiry_date: new Date(expiry_date),
        purchase_price,
        setting_price,
      })

      const batchDoc = batch.toObject()
      const enrichedBatch = enrichBatch(batchDoc)
      return res.status(201).json({ data: enrichedBatch })
    } catch (err) {
      console.error('Error creating batch', err)
      return res.status(500).json({ error: 'Failed to create batch' })
    }
  }

  // PUT /batches/:id
  async update(req: Request, res: Response) {
    try {
      const batch = await Batch.findById(req.params.id)
      if (!batch) return res.status(404).json({ error: 'Batch not found' })

      const {
        supplier,
        quantity,
        purchase_date,
        expiry_date,
        purchase_price,
        setting_price,
      } = req.body

      if (supplier !== undefined) batch.supplier = supplier
      if (quantity !== undefined) batch.quantity = quantity
      if (purchase_date !== undefined) batch.purchase_date = new Date(purchase_date)
      if (expiry_date !== undefined) batch.expiry_date = new Date(expiry_date)
      if (purchase_price !== undefined) batch.purchase_price = purchase_price
      if (setting_price !== undefined) batch.setting_price = setting_price

      await batch.save()
      const batchDoc = batch.toObject()
      const enrichedBatch = enrichBatch(batchDoc)
      return res.json({ data: enrichedBatch })
    } catch (err) {
      console.error('Error updating batch', err)
      return res.status(500).json({ error: 'Failed to update batch' })
    }
  }

  // DELETE /batches/:id
  async delete(req: Request, res: Response) {
    try {
      const batch = await Batch.findById(req.params.id)
      if (!batch) return res.status(404).json({ error: 'Batch not found' })

      // Soft delete
      batch.deleted_at = new Date()
      await batch.save()
      return res.status(204).send()
    } catch (err) {
      console.error('Error deleting batch', err)
      return res.status(500).json({ error: 'Failed to delete batch' })
    }
  }
}

