import dbConnect from '../dbConnect';
import User from '../models/User';
import Doctor from '../models/Doctor';
import Nurse from '../models/Nurse';
import Pharmacist from '../models/Pharmacist';
import LabTechnician from '../models/LabTechnician';

async function seedUsers() {
  try {
    await dbConnect();
    
    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Nurse.deleteMany({});
    await Pharmacist.deleteMany({});
    await LabTechnician.deleteMany({});

    // Create Admin
    const admin = await User.create({
      username: 'admin',
      email: 'admin@carelink.com',
      password: 'Admin123!',
      role: 'admin',
      contactNumber: '+1234567890',
      isActive: true
    });

    // Create Doctor
    const doctor = await User.create({
      username: 'dr.smith',
      email: 'smith@carelink.com',
      password: 'Doctor123!',
      role: 'doctor',
      contactNumber: '+1234567891',
      isActive: true
    });

    await Doctor.create({
      userId: doctor._id,
      specialization: 'Cardiology',
      qualification: ['MBBS', 'MD'],
      licenseNumber: 'DOC2025001',
      consultationFee: 150,
      department: 'Cardiology',
      experience: 10,
      availability: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00' },
        { day: 'Wednesday', startTime: '09:00', endTime: '17:00' }
      ]
    });

    // Create Nurse
    const nurse = await User.create({
      username: 'nurse.jane',
      email: 'jane@carelink.com',
      password: 'Nurse123!',
      role: 'nurse',
      contactNumber: '+1234567892',
      isActive: true
    });

    await Nurse.create({
      userId: nurse._id,
      department: 'Emergency',
      shift: 'Morning',
      qualification: ['BSN', 'RN'],
      licenseNumber: 'NUR2025001',
      specializations: ['Emergency Care', 'Critical Care'],
      assignedWard: 'Emergency Ward'
    });

    // Create Pharmacist
    const pharmacist = await User.create({
      username: 'pharm.johnson',
      email: 'johnson@carelink.com',
      password: 'Pharm123!',
      role: 'pharmacist',
      contactNumber: '+1234567893',
      isActive: true
    });

    await Pharmacist.create({
      userId: pharmacist._id,
      licenseNumber: 'PHA2025001',
      qualification: ['PharmD'],
      shift: 'Morning',
      specialization: 'Clinical Pharmacy'
    });

    // Create Lab Technician
    const labTech = await User.create({
      username: 'lab.tech',
      email: 'labtech@carelink.com',
      password: 'Lab123!',
      role: 'labTechnician',
      contactNumber: '+1234567894',
      isActive: true
    });

    await LabTechnician.create({
      userId: labTech._id,
      specialization: ['Hematology', 'Clinical Chemistry'],
      qualification: ['BSc Medical Laboratory'],
      licenseNumber: 'LAB2025001',
      shift: 'Morning',
      laboratorySection: 'Hematology'
    });

    // Create Receptionist
    const receptionist = await User.create({
      username: 'reception',
      email: 'reception@carelink.com',
      password: 'Reception123!',
      role: 'receptionist',
      contactNumber: '+1234567895',
      isActive: true
    });

    // Create Accountant
    const accountant = await User.create({
      username: 'accounts',
      email: 'accounts@carelink.com',
      password: 'Accounts123!',
      role: 'accountant',
      contactNumber: '+1234567896',
      isActive: true
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedUsers();