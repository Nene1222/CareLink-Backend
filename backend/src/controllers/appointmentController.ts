import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Appointment } from '../models/appointment'

export class AppointmentController {
  private normalize(doc: any) {
    if (!doc) return null
    const { _id, __v, ...rest } = doc
    return { id: _id ? String(_id) : undefined, ...rest }
  }

  async getAll(req: Request, res: Response) {
    try {
      const list = await Appointment.find().sort({ date: -1, time: 1 }).lean()
      res.json({ data: list.map((i) => this.normalize(i)) })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to fetch appointments' })
    }
  }

  async getById(req: Request, res: Response) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
      const item = await Appointment.findById(req.params.id).lean()
      if (!item) return res.status(404).json({ error: 'Not found' })
      res.json({ data: this.normalize(item) })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to fetch appointment' })
    }
  }

  async create(req: Request, res: Response) {
    try {
      const body = req.body || {}
      if (!body.patientName || !body.patientId || !body.doctorName || !body.date || !body.time) {
        return res.status(400).json({ error: 'patientName, patientId, doctorName, date and time are required' })
      }
      const doc = await Appointment.create(body)
      res.status(201).json({ data: this.normalize(doc.toObject()) })
    } catch (err: any) {
      console.error(err)
      res.status(400).json({ error: err.message || 'Failed to create appointment' })
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
      const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean()
      if (!updated) return res.status(404).json({ error: 'Not found' })
      res.json({ data: this.normalize(updated) })
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: 'Failed to update appointment' })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
      const removed = await Appointment.findByIdAndDelete(req.params.id)
      if (!removed) return res.status(404).json({ error: 'Not found' })
      res.status(204).send()
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to delete appointment' })
    }
  }
}