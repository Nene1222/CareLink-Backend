import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Network } from '../models/network'

export class NetworkController {
  private normalize(doc: any) {
    if (!doc) return null
    const { _id, __v, ...rest } = doc
    return { id: _id ? String(_id) : undefined, ...rest }
  }

  // GET all networks
  async getAll(req: Request, res: Response) {
    try {
      const list = await Network.find().sort({ createdAt: -1 }).lean()
      res.json({ data: list.map((item) => this.normalize(item)) })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to fetch networks' })
    }
  }

  // GET network by ID
  async getById(req: Request, res: Response) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
      const item = await Network.findById(req.params.id).lean()
      if (!item) return res.status(404).json({ error: 'Not found' })
      res.json({ data: this.normalize(item) })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to fetch network' })
    }
  }

  // POST create network
  async create(req: Request, res: Response) {
    try {
      const { name, ipAddress } = req.body
      if (!name || !ipAddress) return res.status(400).json({ error: 'name and ipAddress are required' })
      const doc = await Network.create({ name, ipAddress })
      res.status(201).json({ data: this.normalize(doc.toObject()) })
    } catch (err: any) {
      console.error(err)
      res.status(400).json({ error: err.message || 'Failed to create network' })
    }
  }

  // PUT update network
  async update(req: Request, res: Response) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
      const updated = await Network.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean()
      if (!updated) return res.status(404).json({ error: 'Not found' })
      res.json({ data: this.normalize(updated) })
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: 'Failed to update network' })
    }
  }

  // DELETE network
  async delete(req: Request, res: Response) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
      const removed = await Network.findByIdAndDelete(req.params.id)
      if (!removed) return res.status(404).json({ error: 'Not found' })
      res.status(204).send()
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to delete network' })
    }
  }
}