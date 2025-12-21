import { Request, Response } from 'express'
import { GroupMedicine } from '../../models/medical/groupMedicine'
import { Medicine } from '../../models/medical/medicine'
import { Batch } from '../../models/medical/batch'

export class MedicineGroupController {
  // Helper function to enrich group with statistics
  // Returns: Group Name, Count of unique medicines, Sum of all stock units, List of medicine names
  private async enrichGroup(group: any) {
    // Get all non-deleted medicines in this group
    const medicines = await Medicine.find({ 
      group_medicine_id: group._id,
      deleted_at: null 
    }).lean()
    
    // Get all batches for medicines in this group (for stock calculation)
    const medicineIds = medicines.map(m => m._id)
    const batches = await Batch.find({ 
      medicine_id: { $in: medicineIds },
      deleted_at: null 
    }).lean()
    
    // Count of unique medicines in the group
    const totalMedicines = medicines.length
    
    // Sum of all stock units (batch quantities) for all medicines in this group
    const totalStocks = batches.reduce((sum, batch) => sum + (batch.quantity || 0), 0)
    
    // List of medicine names (show first 5 for preview)
    const medicineNames = medicines.slice(0, 5).map(m => ({ name: m.name }))
    
    return {
      id: group._id.toString(),
      title: group.group_name, // Group Name
      group_name: group.group_name,
      totalMedicines, // Count of unique medicines
      totalStocks, // Sum of all stock units
      medicines: medicineNames, // List of medicine names (few shown)
      deleted_at: group.deleted_at,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    }
  }

  // GET /medicine-groups
  async getAll(req: Request, res: Response) {
    try {
      const searchQuery = req.query.search as string | undefined
      
      // Build query with optional search
      const query: any = { deleted_at: null }
      if (searchQuery && searchQuery.trim()) {
        // Search by group name (case-insensitive)
        query.group_name = { $regex: searchQuery.trim(), $options: 'i' }
      }
      
      const groups = await GroupMedicine.find(query).lean()
      const enrichedGroups = await Promise.all(
        groups.map(group => this.enrichGroup(group))
      )
      return res.json({ data: enrichedGroups })
    } catch (err) {
      console.error('Error fetching medicine groups', err)
      return res.status(500).json({ error: 'Failed to fetch medicine groups' })
    }
  }

  // GET /medicine-groups/:id
  async getById(req: Request, res: Response) {
    try {
      const group = await GroupMedicine.findById(req.params.id).lean()
      if (!group) return res.status(404).json({ error: 'Medicine group not found' })
      const enrichedGroup = await this.enrichGroup(group)
      return res.json({ data: enrichedGroup })
    } catch (err) {
      console.error('Error fetching medicine group', err)
      return res.status(500).json({ error: 'Failed to fetch medicine group' })
    }
  }

  // POST /medicine-groups
  async create(req: Request, res: Response) {
    try {
      const group_name = req.body.group_name ?? req.body.title
      const deleted_at = req.body.deleted_at
      if (!group_name) {
        return res.status(400).json({ error: 'group_name is required' })
      }
      const group = await GroupMedicine.create({ group_name, deleted_at })
      const groupDoc = group.toObject()
      const enrichedGroup = await this.enrichGroup(groupDoc)
      return res.status(201).json({ data: enrichedGroup })
    } catch (err) {
      console.error('Error creating medicine group', err)
      return res.status(500).json({ error: 'Failed to create medicine group' })
    }
  }

  // PUT /medicine-groups/:id
  async update(req: Request, res: Response) {
    try {
      const group = await GroupMedicine.findById(req.params.id)
      if (!group) return res.status(404).json({ error: 'Medicine group not found' })

      const group_name = req.body.group_name ?? req.body.title
      const deleted_at = req.body.deleted_at
      if (group_name !== undefined) group.group_name = group_name
      if (deleted_at !== undefined) group.deleted_at = deleted_at
      await group.save()
      const groupDoc = group.toObject()
      const enrichedGroup = await this.enrichGroup(groupDoc)
      return res.json({ data: enrichedGroup })
    } catch (err) {
      console.error('Error updating medicine group', err)
      return res.status(500).json({ error: 'Failed to update medicine group' })
    }
  }

  // DELETE /medicine-groups/:id
  async delete(req: Request, res: Response) {
    try {
      const group = await GroupMedicine.findById(req.params.id)
      if (!group) return res.status(404).json({ error: 'Medicine group not found' })

      await group.deleteOne()
      return res.status(204).send()
    } catch (err) {
      console.error('Error deleting medicine group', err)
      return res.status(500).json({ error: 'Failed to delete medicine group' })
    }
  }
}
