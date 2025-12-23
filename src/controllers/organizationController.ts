import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Organization } from '../models/organization'
import { Network } from '../models/network' // added

export class OrganizationController {
  private normalize(doc: any) {
    if (!doc) return null
    const { _id, __v, ...rest } = doc
    return { id: _id ? String(_id) : undefined, ...rest }
  }

  // GET all organizations
  async getAll(req: Request, res: Response) {
    try {
      const list = await Organization.find().sort({ createdAt: -1 }).lean()
      res.json({ data: list.map((item) => this.normalize(item)) })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to fetch organizations' })
    }
  }

  // GET organization by ID
  async getById(req: Request, res: Response) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
      const item = await Organization.findById(req.params.id).lean()
      if (!item) return res.status(404).json({ error: 'Not found' })
      res.json({ data: this.normalize(item) })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to fetch organization' })
    }
  }

  // POST create organization
  async create(req: Request, res: Response) {
    try {
      const { name, type, recordType, network, logo } = req.body
      if (!name) return res.status(400).json({ error: 'name is required' })

      // LIMITATION: Only ONE organization is allowed for the attendance system
      const existingOrganization = await Organization.findOne({})
      if (existingOrganization) {
        return res.status(400).json({
          error: 'Only one organization is allowed in the attendance system. An organization already exists.',
          existingOrganization: this.normalize(existingOrganization.toObject())
        })
      }

      // resolve or create network
      let networkId: any = undefined
      if (network) {
        if (mongoose.Types.ObjectId.isValid(network)) {
          networkId = network
        } else if (typeof network === 'object' && network.name && network.ipAddress) {
          const createdNet = await Network.create({ name: network.name, ipAddress: network.ipAddress })
          networkId = createdNet._id
        } else if (typeof network === 'string') {
          const found = await Network.findOne({ $or: [{ name: network }, { ipAddress: network }] }).lean()
          if (found) networkId = found._id
        }
      }

      const doc = await Organization.create({
        name,
        type: type || undefined,
        recordType: recordType || undefined,
        network: networkId ?? undefined,
        logo: logo || undefined,
      })
      res.status(201).json({ data: this.normalize(doc.toObject()) })
    } catch (err: any) {
      console.error(err)
      res.status(400).json({ error: err.message || 'Failed to create organization' })
    }
  }

  // PUT update organization
  async update(req: Request, res: Response) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' })

      const body = req.body || {}

      // resolve or create network if provided
      if (body.network) {
        if (mongoose.Types.ObjectId.isValid(body.network)) {
          body.network = body.network
        } else if (typeof body.network === 'object' && body.network.name && body.network.ipAddress) {
          const createdNet = await Network.create({ name: body.network.name, ipAddress: body.network.ipAddress })
          body.network = createdNet._id
        } else if (typeof body.network === 'string') {
          const found = await Network.findOne({ $or: [{ name: body.network }, { ipAddress: body.network }] }).lean()
          if (found) body.network = found._id
        }
      }

      const updated = await Organization.findByIdAndUpdate(req.params.id, body, { new: true }).lean()
      if (!updated) return res.status(404).json({ error: 'Not found' })
      res.json({ data: this.normalize(updated) })
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: 'Failed to update organization' })
    }
  }

  // DELETE organization
  async delete(req: Request, res: Response) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
      const removed = await Organization.findByIdAndDelete(req.params.id)
      if (!removed) return res.status(404).json({ error: 'Not found' })
      res.status(204).send()
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to delete organization' })
    }
  }
}