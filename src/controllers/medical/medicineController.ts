import { Request, Response } from 'express'
import { Medicine } from '../../models/medical/medicine'
import { GroupMedicine } from '../../models/medical/groupMedicine'
import { Batch } from '../../models/medical/batch'
import { getBarcodeImageUrl, getProductImageUrl } from '../../utils/upload'
import { generateBarcodeValueFromImage } from '../../utils/barcodeExtractor'

export class MedicineController {
  // GET /medicines
  async getAll(_req: Request, res: Response) {
    try {
      const medicines = await Medicine.find().populate('group_medicine_id', 'group_name').lean()
      return res.json({ data: medicines })
    } catch (err) {
      console.error('Error fetching medicines', err)
      return res.status(500).json({ error: 'Failed to fetch medicines' })
    }
  }

  // GET /medicines/:id
  async getById(req: Request, res: Response) {
    try {
      const medicine = await Medicine.findById(req.params.id)
        .populate('group_medicine_id', 'group_name')
        .lean()
      if (!medicine) return res.status(404).json({ error: 'Medicine not found' })
      
      // Calculate stock from batches
      const batches = await Batch.find({
        medicine_id: medicine._id,
        deleted_at: null
      }).lean()
      
      const totalStock = batches.reduce((sum, batch) => sum + (batch.quantity || 0), 0)
      const batchCount = batches.length
      
      return res.json({
        data: {
          ...medicine,
          stock: {
            total: totalStock,
            batches: batchCount
          }
        }
      })
    } catch (err) {
      console.error('Error fetching medicine', err)
      return res.status(500).json({ error: 'Failed to fetch medicine' })
    }
  }

  // GET /medicines/group/:groupName
  async getByGroup(req: Request, res: Response) {
    try {
      const group = await GroupMedicine.findOne({ group_name: req.params.groupName }).lean()
      if (!group) return res.json({ data: [] })
      const medicines = await Medicine.find({ group_medicine_id: group._id })
        .populate('group_medicine_id', 'group_name')
        .lean()
      return res.json({ data: medicines })
    } catch (err) {
      console.error('Error fetching medicines by group', err)
      return res.status(500).json({ error: 'Failed to fetch medicines by group' })
    }
  }

  // GET /medicines/group-id/:groupId
  async getByGroupId(req: Request, res: Response) {
    try {
      const searchQuery = req.query.search as string | undefined
      
      // Build query with optional search
      const query: any = { 
        group_medicine_id: req.params.groupId,
        deleted_at: null
      }
      
      if (searchQuery && searchQuery.trim()) {
        // Search by medicine name (case-insensitive)
        query.name = { $regex: searchQuery.trim(), $options: 'i' }
      }
      
      const medicines = await Medicine.find(query)
        .populate('group_medicine_id', 'group_name')
        .lean()
      return res.json({ data: medicines })
    } catch (err) {
      console.error('Error fetching medicines by group id', err)
      return res.status(500).json({ error: 'Failed to fetch medicines by group id' })
    }
  }

  // POST /medicines
  async create(req: Request, res: Response) {
    try {
      const { group_medicine_id, name, description, photo, deleted_at } = req.body
      if (!group_medicine_id || !name) {
        return res.status(400).json({ error: 'group_medicine_id and name are required' })
      }
      
      // Verify group exists
      const group = await GroupMedicine.findById(group_medicine_id)
      if (!group) {
        return res.status(400).json({ error: 'Invalid group_medicine_id' })
      }
      
      // Handle uploaded files (barcode_image and photo)
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined
      const barcodeFile = files?.barcode_image?.[0]
      const photoFile = files?.photo?.[0]

      let barcode_image = null
      let barcode_value = null
      let product_photo = photo ?? null

      if (barcodeFile) {
        barcode_image = getBarcodeImageUrl(barcodeFile.filename)
        try {
          barcode_value = await generateBarcodeValueFromImage(barcodeFile.path)
        } catch (error) {
          console.error('Error extracting barcode value:', error)
          // Continue without barcode value if extraction fails
        }
      }

      if (photoFile) {
        product_photo = getProductImageUrl(photoFile.filename)
      }
      
      const medicine = await Medicine.create({
        group_medicine_id,
        name,
        description,
        photo: product_photo,
        barcode_image,
        barcode_value,
        deleted_at,
      })
      
      // Populate and return the created medicine
      const populatedMedicine = await Medicine.findById(medicine._id)
        .populate('group_medicine_id', 'group_name')
        .lean()
      
      return res.status(201).json({ data: populatedMedicine })
    } catch (err) {
      console.error('Error creating medicine', err)
      return res.status(500).json({ error: 'Failed to create medicine' })
    }
  }

  // PUT /medicines/:id
  async update(req: Request, res: Response) {
    try {
      const { group_medicine_id, name, description, photo, deleted_at } = req.body
      const medicine = await Medicine.findById(req.params.id)
      if (!medicine) return res.status(404).json({ error: 'Medicine not found' })

      // Handle uploaded files (barcode_image and photo)
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined
      const barcodeFile = files?.barcode_image?.[0]
      const photoFile = files?.photo?.[0]

      if (group_medicine_id !== undefined) medicine.group_medicine_id = group_medicine_id
      if (name !== undefined) medicine.name = name
      if (description !== undefined) medicine.description = description
      if (photo !== undefined) medicine.photo = photo
      if (photoFile) medicine.photo = getProductImageUrl(photoFile.filename)
      if (deleted_at !== undefined) medicine.deleted_at = deleted_at
      
      // Handle barcode image upload
      if (barcodeFile) {
        medicine.barcode_image = getBarcodeImageUrl(barcodeFile.filename)
        try {
          medicine.barcode_value = await generateBarcodeValueFromImage(barcodeFile.path)
        } catch (error) {
          console.error('Error extracting barcode value:', error)
          // Continue without updating barcode value if extraction fails
        }
      }

      await medicine.save()
      return res.json({ data: medicine })
    } catch (err) {
      console.error('Error updating medicine', err)
      return res.status(500).json({ error: 'Failed to update medicine' })
    }
  }

  // DELETE /medicines/:id
  async delete(req: Request, res: Response) {
    try {
      const medicine = await Medicine.findById(req.params.id)
      if (!medicine) return res.status(404).json({ error: 'Medicine not found' })

      await medicine.deleteOne()
      return res.status(204).send()
    } catch (err) {
      console.error('Error deleting medicine', err)
      return res.status(500).json({ error: 'Failed to delete medicine' })
    }
  }
}
