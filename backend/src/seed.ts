import { Attendance } from './models/attendance'
import { Organization } from './models/organization'
import { Network } from './models/network'
import { Appointment } from './models/appointment'

export async function seedDatabase() {
  try {
    const attCount = await Attendance.countDocuments()
    const orgCount = await Organization.countDocuments()
    const netCount = await Network.countDocuments()
    const appCount = await Appointment.countDocuments()

    let networks: any[] = []
    if (netCount === 0) {
      const nets = [
        { name: 'Main Network', ipAddress: '192.168.1.1' },
        { name: 'My home', ipAddress: '175.100.10.230' },
      ]
      networks = await Network.insertMany(nets)
      console.log('Seeded networks')
    } else {
      networks = await Network.find().lean()
    }

    let orgs: any[] = []
    if (orgCount === 0) {
      const orgDocs = [
        { name: 'Main Clinic', type: 'Primary Care', recordType: 'Hospital', network: networks[0]._id, logo: '🏥' },
        { name: 'Dental Center', type: 'Dental', recordType: 'Clinic', network: networks[1]._id, logo: '🦷' },
      ]
      orgs = await Organization.insertMany(orgDocs)
      console.log('Seeded organizations')
    } else {
      orgs = await Organization.find().lean()
    }

    if (attCount === 0) {
      const defaultDate = new Date().toISOString().split('T')[0]
      const attendances = [
        {
          profile: '👨‍⚕️',
          name: 'Dr. Sarah Johnson',
          staffId: 'S001',
          role: 'General Physician',
          organizationId: orgs[0]._id,
          organization: orgs[0].name,
          room: '101',
          shift: 'Morning',
          checkInTime: '08:45 AM',
          date: defaultDate,
          status: 'present',
        },
        {
          profile: '👨‍⚕️',
          name: 'Dr. Michael Chen',
          staffId: 'S002',
          role: 'Cardiologist',
          organizationId: orgs[0]._id,
          organization: orgs[0].name,
          room: '202',
          shift: 'Morning',
          checkInTime: '09:15 AM',
          date: defaultDate,
          status: 'late',
        },
        {
          profile: '👩‍⚕️',
          name: 'Nurse Emma Wilson',
          staffId: 'S003',
          role: 'Registered Nurse',
          organizationId: orgs[0]._id,
          organization: orgs[0].name,
          room: '103',
          shift: 'Morning',
          checkInTime: '08:30 AM',
          checkOutTime: '05:30 PM',
          date: defaultDate,
          status: 'present',
        },
      ]
      await Attendance.insertMany(attendances)
      console.log('Seeded attendances')
    }

    if (appCount === 0) {
      await Appointment.insertMany([
        { patientName: 'Sambo Sopheakline', patientId: 'P001', doctorName: 'Dr. Sarah Johnson', doctorRole: 'General Physician', date: '2025-01-20', time: '09:00 AM', room: 'Room 101', reason: 'Regular checkup' },
        { patientName: 'Sambo Sopheaklinet', patientId: 'P002', doctorName: 'Dr. Michael Chen', doctorRole: 'Cardiologist', date: '2025-01-21', time: '10:00 AM', room: 'Room 202', reason: 'Follow-up' },
        { patientName: 'Poch Sreypov', patientId: 'P003', doctorName: 'Dr. Sarah Johnson', doctorRole: 'General Physician', date: '2025-01-22', time: '11:00 AM', room: 'Room 101', reason: 'Consultation' },
      ])
      console.log('Seeded appointments')
    }

    console.log('Seeding complete')
  } catch (err) {
    console.error('Seed error', err)
    throw err
  }
}