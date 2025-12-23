// src/controllers/attendanceController.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Attendance } from '../models/attendance';
import { Organization } from '../../../models/organization';
import { Network } from '../../../models/network' // added
import pusher from '../../../pusher';

export class AttendanceController {
  private normalize(doc: any) {
    if (!doc) return null;
    const { _id, __v, organizationId, networkId, organization, ...rest } = doc;

    const orgPop = organizationId && typeof organizationId === 'object' && (organizationId as any).name ? organizationId as any : null;
    const netPop = networkId && typeof networkId === 'object' && (networkId as any).name ? networkId as any : null;

    return {
      id: _id ? String(_id) : undefined,
      ...rest,
      organization: organization || (orgPop ? orgPop.name : (organizationId ? String((organizationId as any)._id ?? organizationId) : '')),
      organizationId: orgPop ? String(orgPop._id) : (organizationId ? String((organizationId as any)._id ?? organizationId) : undefined),
      networkId: netPop ? String(netPop._id) : (networkId ? String((networkId as any)._id ?? networkId) : undefined),
      networkName: netPop ? netPop.name : undefined,
    };
  }

  async getAll(req: Request, res: Response) {
    try {
      const list = await Attendance.find()
        .populate('organizationId')
        .populate('networkId')
        .sort({ createdAt: -1 })
        .lean();
      res.json({ data: list.map((item) => this.normalize(item)) });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch attendance' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
      const item = await Attendance.findById(req.params.id).populate('organizationId').populate('networkId').lean();
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json({ data: this.normalize(item) });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch attendance' });
    }
  }

  // POST create attendance
  async create(req: Request, res: Response) {
    try {
      const body = req.body || {}
      if (!body?.name || !body?.staffId || !body?.date) {
        return res.status(400).json({ error: 'name, staffId and date are required' })
      }

      // Resolve organizationId (accept organization name or id)
      let organizationId = body.organizationId
      if (!organizationId && body.organization) {
        const org = await Organization.findOne({ name: body.organization }).lean()
        if (org) organizationId = org._id
      }

      // network: allow explicit networkId; accept network object or name/ip and create/find if needed
      let networkId = body.networkId ?? undefined
      if (!networkId && body.network) {
        // if network is an ObjectId string
        if (typeof body.network === 'string' && mongoose.Types.ObjectId.isValid(body.network)) {
          networkId = body.network
        } else if (typeof body.network === 'object' && body.network.name && body.network.ipAddress) {
          const createdNet = await Network.create({ name: body.network.name, ipAddress: body.network.ipAddress })
          networkId = createdNet._id
        } else if (typeof body.network === 'string') {
          const found = await Network.findOne({ $or: [{ name: body.network }, { ipAddress: body.network }] }).lean()
          if (found) networkId = found._id
        }
      }

      // if still no networkId, derive from organization
      if (!networkId && organizationId) {
        const orgDoc = await Organization.findById(organizationId).lean()
        if (orgDoc && orgDoc.network) networkId = orgDoc.network
      }

      const createPayload: any = {
        profile: body.profile,
        name: body.name,
        staffId: body.staffId,
        role: body.role,
        organizationId: organizationId ?? undefined,
        organization: body.organization,
        networkId: networkId ?? undefined,
        room: body.room,
        shift: body.shift,
        checkInTime: body.checkInTime,
        checkOutTime: body.checkOutTime,
        date: body.date,
        status: body.status || 'present',
        notes: body.notes,
      }

      const doc = await Attendance.create(createPayload)
      const created = await Attendance.findById((doc as any)._id).populate('organizationId').populate('networkId').lean()
      
      // Trigger Pusher notification for attendance created (non-blocking)
      try {
        await pusher.trigger('attendance-channel', 'attendance-updated', {
          type: 'created',
          attendanceId: String((doc as any)._id),
          userId: body.staffId,
          name: body.name,
          checkInTime: body.checkInTime,
          timestamp: new Date(),
          message: `${body.name} (${body.staffId}) checked in at ${body.checkInTime}`,
        })
      } catch (pErr) {
        console.error('Pusher trigger failed (create):', pErr)
      }
      
      res.status(201).json({ data: this.normalize(created) })
    } catch (err: any) {
      console.error(err)
      res.status(400).json({ error: err.message || 'Failed to create' })
    }
  }

  // PUT update attendance
  async update(req: Request, res: Response) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' })

      const body = req.body || {}

      // If organization provided as name and organizationId not given, resolve to id
      if (body.organization && !body.organizationId) {
        const org = await Organization.findOne({ name: body.organization }).lean()
        if (org) body.organizationId = org._id
      }

      // IMPORTANT: allow explicit networkId updates.
      // If network provided explicitly (networkId or network object), respect it.
      if (body.networkId === undefined || body.networkId === null) {
        // check body.network for object/string
        if (body.network) {
          if (typeof body.network === 'string' && mongoose.Types.ObjectId.isValid(body.network)) {
            body.networkId = body.network
          } else if (typeof body.network === 'object' && body.network.name && body.network.ipAddress) {
            const createdNet = await Network.create({ name: body.network.name, ipAddress: body.network.ipAddress })
            body.networkId = createdNet._id
          } else if (typeof body.network === 'string') {
            const found = await Network.findOne({ $or: [{ name: body.network }, { ipAddress: body.network }] }).lean()
            if (found) body.networkId = found._id
          }
        } else {
          // fallback: derive from organization if organizationId present
          const orgIdToUse = body.organizationId
          if (orgIdToUse) {
            const orgDoc = await Organization.findById(orgIdToUse).lean()
            if (orgDoc && orgDoc.network) body.networkId = orgDoc.network
          }
        }
      }

      const updated = await Attendance.findByIdAndUpdate(req.params.id, body, { new: true })
        .populate('organizationId')
        .populate('networkId')
        .lean()
      if (!updated) return res.status(404).json({ error: 'Not found' })
      
      // Determine notification type
      let notificationType = 'updated'
      let notificationMessage = `${updated.name} record updated`
      
      if (body.checkOutTime && !body.checkOutTime.isEmpty) {
        notificationType = 'checkout'
        notificationMessage = `${updated.name} checked out at ${body.checkOutTime}`
      }
      
      // Trigger Pusher notification (non-blocking)
      try {
        await pusher.trigger('attendance-channel', 'attendance-updated', {
          type: notificationType,
          attendanceId: String(updated._id),
          userId: updated.staffId,
          name: updated.name,
          timestamp: new Date(),
          message: notificationMessage,
        })
      } catch (pErr) {
        console.error('Pusher trigger failed (update):', pErr)
      }
      
      res.json({ data: this.normalize(updated) })
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: 'Failed to update' })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
      const removed = await Attendance.findByIdAndDelete(req.params.id);
      if (!removed) return res.status(404).json({ error: 'Not found' });
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete attendance' });
    }
  }

  // NEW: Checkout method
  async checkOut(req: Request, res: Response) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
      
      const checkOutTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      
      const updated = await Attendance.findByIdAndUpdate(
        req.params.id,
        { checkOutTime },
        { new: true }
      )
        .populate('organizationId')
        .populate('networkId')
        .lean();
      
      if (!updated) return res.status(404).json({ error: 'Not found' });
      
      // Trigger Pusher notification for checkout (non-blocking)
      try {
        await pusher.trigger('attendance-channel', 'attendance-updated', {
          type: 'checkout',
          attendanceId: String(updated._id),
          userId: updated.staffId,
          name: updated.name,
          checkOutTime,
          timestamp: new Date(),
          message: `${updated.name} checked out at ${checkOutTime}`,
        });
      } catch (pErr) {
        console.error('Pusher trigger failed (checkout):', pErr)
      }
      
      res.json({ data: this.normalize(updated) });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to checkout' });
    }
  }

  // NEW: Approval update method
  async updateApproval(req: Request, res: Response) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' });

      const { approval } = req.body;

      if (!approval || !['accepted', 'rejected', 'pending'].includes(approval)) {
        return res.status(400).json({ error: 'Approval must be "accepted", "rejected", or "pending"' });
      }

      const updated = await Attendance.findByIdAndUpdate(
        req.params.id,
        { approval },
        { new: true }
      )
        .populate('organizationId')
        .populate('networkId')
        .lean();

      if (!updated) return res.status(404).json({ error: 'Attendance record not found' });

      // Trigger Pusher notification for approval update (non-blocking)
      try {
        await pusher.trigger('attendance-channel', 'attendance-updated', {
          type: approval === 'accepted' ? 'approved' : approval === 'rejected' ? 'rejected' : 'pending',
          attendanceId: String(updated._id),
          userId: updated.staffId,
          name: updated.name,
          approval,
          timestamp: new Date(),
          message: `Attendance ${approval} for ${updated.name}`,
        });
      } catch (pErr) {
        console.error('Pusher trigger failed (approval):', pErr)
      }

      res.json({ data: this.normalize(updated) });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update approval status' });
    }
  }
}
