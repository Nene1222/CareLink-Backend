import { Request, Response } from 'express'
import { Attendance } from '../features/attendance/models/attendance'

/**
 * Mock Users Controller
 * Provides endpoints for fetching doctors and patients
 * Used for dropdown population until user management system is implemented
 */
export class MockUsersController {
  // GET /api/doctors - Get list of doctors (from Attendance with doctor roles)
  async getDoctors(_req: Request, res: Response) {
    try {
      // Fetch doctors from Attendance records where role contains "doctor" or "physician"
      // Also include mock doctors for development
      const attendanceDoctors = await Attendance.find({
        $or: [
          { role: { $regex: /doctor|physician|Dr\./i } },
          { name: { $regex: /^Dr\./i } }
        ],
        deleted_at: { $exists: false }
      })
        .select('_id name role staffId')
        .lean()
        .limit(50)

      // Mock doctors data (for development/testing)
      const mockDoctors = [
        {
          _id: 'mock-doctor-1',
          name: 'Dr. Sreypich Heng',
          role: 'General Physician',
          staffId: 'DOC001'
        },
        {
          _id: 'mock-doctor-2',
          name: 'Dr. Vannak Chhay',
          role: 'Cardiologist',
          staffId: 'DOC002'
        },
        {
          _id: 'mock-doctor-3',
          name: 'Dr. Kanika Phan',
          role: 'Pediatrician',
          staffId: 'DOC003'
        },
        {
          _id: 'mock-doctor-4',
          name: 'Dr. Rithy Sok',
          role: 'Orthopedic Surgeon',
          staffId: 'DOC004'
        },
        {
          _id: 'mock-doctor-5',
          name: 'Dr. Sreymom Keo',
          role: 'Dermatologist',
          staffId: 'DOC005'
        },
        {
          _id: 'mock-doctor-6',
          name: 'Dr. Dara Chum',
          role: 'Neurologist',
          staffId: 'DOC006'
        },
        {
          _id: 'mock-doctor-7',
          name: 'Dr. Sotheary Phan',
          role: 'Gynecologist',
          staffId: 'DOC007'
        },
        {
          _id: 'mock-doctor-8',
          name: 'Dr. Piseth Rith',
          role: 'Psychiatrist',
          staffId: 'DOC008'
        }
      ]
      

      // Combine attendance doctors with mock doctors
      // Convert attendance doctors to same format
      const formattedAttendanceDoctors = attendanceDoctors.map(doc => ({
        _id: doc._id.toString(),
        name: doc.name,
        role: doc.role || 'Doctor',
        staffId: doc.staffId
      }))

      // Merge and remove duplicates by name
      const allDoctors = [...formattedAttendanceDoctors, ...mockDoctors]
      const uniqueDoctors = Array.from(
        new Map(allDoctors.map(doc => [doc.name, doc])).values()
      )

      return res.json({
        data: uniqueDoctors.sort((a, b) => a.name.localeCompare(b.name))
      })
    } catch (err) {
      console.error('Error fetching doctors', err)
      return res.status(500).json({ error: 'Failed to fetch doctors' })
    }
  }

  // GET /api/patients - Get list of mock patients
  async getPatients(_req: Request, res: Response) {
    try {
      // Mock patients data (for development/testing)
      const mockPatients = [
        {
          id: 'PAT001',
          name: 'Rotha Munyputhida',
          gender: 'Female',
          dateOfBirth: '2004-08-06',
          age: 21
        },
        {
          id: 'PAT002',
          name: 'Sophea Chann',
          gender: 'Female',
          dateOfBirth: '1995-03-15',
          age: 29
        },
        {
          id: 'PAT003',
          name: 'Poch Sreypov',
          gender: 'Female',
          dateOfBirth: '1998-11-22',
          age: 26
        },
        {
          id: 'PAT004',
          name: 'Sovann Samnang',
          gender: 'Male',
          dateOfBirth: '1985-07-10',
          age: 39
        },
        {
          id: 'PAT005',
          name: 'Kanika Chhay',
          gender: 'Female',
          dateOfBirth: '1970-05-15',
          age: 54
        },
        {
          id: 'PAT006',
          name: 'Vuthy Rith',
          gender: 'Male',
          dateOfBirth: '1992-12-05',
          age: 32
        },
        {
          id: 'PAT007',
          name: 'Sreymom Keo',
          gender: 'Female',
          dateOfBirth: '1988-09-18',
          age: 36
        },
        {
          id: 'PAT008',
          name: 'Rithy Chum',
          gender: 'Male',
          dateOfBirth: '1995-04-25',
          age: 29
        },
        {
          id: 'PAT009',
          name: 'SreyNeang Phan',
          gender: 'Female',
          dateOfBirth: '2000-01-30',
          age: 24
        },
        {
          id: 'PAT010',
          name: 'Sokha Heng',
          gender: 'Male',
          dateOfBirth: '1987-06-12',
          age: 37
        }
      ]
      
      return res.json({
        data: mockPatients.sort((a, b) => a.name.localeCompare(b.name))
      })
    } catch (err) {
      console.error('Error fetching patients', err)
      return res.status(500).json({ error: 'Failed to fetch patients' })
    }
  }
}

