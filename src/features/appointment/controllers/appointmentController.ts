// C:\Year 4\cap2-project\backend\src\controllers\appointmentController.ts
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
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).json({ error: 'Invalid id' })

      const item = await Appointment.findById(req.params.id).lean()
      if (!item) return res.status(404).json({ error: 'Not found' })

      res.json({ data: this.normalize(item) })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to fetch appointment' })
    }
  }

// backend/src/controllers/appointmentController.ts (patch parts)
  async create(req: Request, res: Response) {
    try {
      const body = req.body || {}
      const { patientName, patientId, doctorName, service, date, time, room, reason, notes } = body

      if (!patientName || !patientId || !doctorName || !date || !time) {
        return res.status(400).json({ error: 'patientName, patientId, doctorName, date and time are required' })
      }

      const payload = { patientName, patientId, doctorName, service, date, time, room, reason, notes }
      const doc = await Appointment.create(payload)
      res.status(201).json({ data: this.normalize(doc.toObject()) })
    } catch (err: any) {
      console.error(err)
      res.status(400).json({ error: err.message || 'Failed to create appointment' })
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' })

      const body = req.body || {}
      const { patientName, patientId, doctorName, service, date, time, room, reason, notes } = body
      const payload: any = { }

      if (patientName !== undefined) payload.patientName = patientName
      if (patientId !== undefined) payload.patientId = patientId
      if (doctorName !== undefined) payload.doctorName = doctorName
      if (service !== undefined) payload.service = service
      if (date !== undefined) payload.date = date
      if (time !== undefined) payload.time = time
      if (room !== undefined) payload.room = room
      if (reason !== undefined) payload.reason = reason
      if (notes !== undefined) payload.notes = notes

      const updated = await Appointment.findByIdAndUpdate(req.params.id, payload, { new: true }).lean()
      if (!updated) return res.status(404).json({ error: 'Not found' })
      res.json({ data: this.normalize(updated) })
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: 'Failed to update appointment' })
    }
  }


  // async update(req: Request, res: Response) {
  //   try {
  //     if (!mongoose.Types.ObjectId.isValid(req.params.id))
  //       return res.status(400).json({ error: 'Invalid id' })

  //     const body = { ...(req.body || {}) }

  //     // trim strings
  //     if (typeof body.patientName === 'string') body.patientName = body.patientName.trim()
  //     if (typeof body.patientId === 'string') body.patientId = body.patientId.trim()
  //     if (typeof body.doctorName === 'string') body.doctorName = body.doctorName.trim()
  //     if (typeof body.service === 'string') body.service = body.service.trim()
  //     if (typeof body.date === 'string') body.date = body.date.trim()
  //     if (typeof body.time === 'string') body.time = body.time.trim()

  //     // remove doctorRole entirely (ignore if sent)
  //     if ('doctorRole' in body) delete body.doctorRole

  //     // Validation same as create:
  //     if (!body.doctorName && !body.service) {
  //       return res.status(400).json({
  //         error: 'Either doctorName or service must be provided'
  //       })
  //     }

  //     const updated = await Appointment.findByIdAndUpdate(
  //       req.params.id,
  //       body,
  //       { new: true }
  //     ).lean()

  //     if (!updated) return res.status(404).json({ error: 'Not found' })

  //     res.json({ data: this.normalize(updated) })
  //   } catch (err) {
  //     console.error(err)
  //     res.status(400).json({ error: 'Failed to update appointment' })
  //   }
  // }

  async delete(req: Request, res: Response) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).json({ error: 'Invalid id' })

      const removed = await Appointment.findByIdAndDelete(req.params.id)
      if (!removed) return res.status(404).json({ error: 'Not found' })

      res.status(204).send()
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to delete appointment' })
    }
  }
}
