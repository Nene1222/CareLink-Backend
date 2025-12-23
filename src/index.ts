import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import attendanceRouter from './features/attendance/routes/attendance'
import organizationsRouter from './routes/organizations'
import networksRouter from './routes/networks'
import appointmentsRouter from './features/appointment/routes/appointments'
import medicineGroupsRouter from './routes/medical/medicineGroups'
import medicinesRouter from './routes/medicines'
import batchesRouter from './routes/medical/batches'
import barcodeRouter from './routes/medical/barcode'
import medicalRecordsRouter from './routes/medical/medicalRecords'
import { connectDb } from './db'
import { seedDatabase } from './seed' // <-- new
// Import MedicalRecord model to ensure it's registered with Mongoose
import './models/medical/medicalRecord'
import paymentRoute from "./routes/pos_routes/paymentRoutes";
import cartRoutes from "./routes/pos_routes/cartRoute";
import invoiceRoutes from './routes/pos_routes/invoiceRoutes';

dotenv.config()

const app = express()

// Allow specific frontend origin
app.use(cors({
  origin: true, // allows all origins
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'UPDATE', 'DELETE'],
  credentials: true, // if you send cookies/auth
}));
// app.use(cors())
app.use(express.json())

app.use('/api/attendance', attendanceRouter)
app.use('/api/organizations', organizationsRouter)
app.use('/api/networks', networksRouter)
app.use('/api/appointments', appointmentsRouter)
app.use('/api/medicines', medicinesRouter)
app.use('/api/medicine-groups', medicineGroupsRouter)
app.use('/api/batches', batchesRouter)
app.use('/api/barcode', barcodeRouter)
app.use('/api/medical-records', medicalRecordsRouter)

//=============== POS ROUTES ================
app.use("/api/payment", paymentRoute);
app.use("/api/cart", cartRoutes);
app.use('/api/invoices', invoiceRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }))

// async function start() {
//   try {
//     await connectDb()
//     // run seed only once if collections empty
//     await seedDatabase()

//     app.listen(PORT, () => {
//       console.log(`Backend listening on http://localhost:${PORT}`)
//     })
//   } catch (err) {
//     console.error('Startup error', err)
//     process.exit(1)
//   }
// }

// start()

export default app;