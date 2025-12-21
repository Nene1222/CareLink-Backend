import express from "express";
import userRoutes from "./user.routes";
import staffRoutes from "./staff.routes";
import roleRoutes from "./role.routes";
import nurseRoutes from "./nurse.routes";
import pharmacistRoutes from "./pharmacist.routes";
import doctorRoutes from "./doctor.routes";
import patientRoutes from "./patient.routes";
import labTechnicianRoutes from "./labTechnician.routes";


const router = express.Router();

// User routes
router.use("/users", userRoutes);

// Staff routes
router.use("/staff", staffRoutes);

// Role routes
router.use("/roles", roleRoutes);

// Nurse routes
router.use("/nurses", nurseRoutes);

// Pharmacist routes
router.use("/pharmacists", pharmacistRoutes);

// Doctor routes
router.use("/doctors", doctorRoutes);

// Patient routes
router.use("/patients", patientRoutes);

// Lab Technician routes
router.use("/lab-technicians", labTechnicianRoutes);



export default router;
