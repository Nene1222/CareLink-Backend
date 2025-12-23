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
import mockUsersRouter from './routes/mockUsers'
import { connectDb } from './db'
import { seedDatabase } from './seed' // <-- new
// Import MedicalRecord model to ensure it's registered with Mongoose
import './models/medical/medicalRecord'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT || 3000)

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.use('/api/attendance', attendanceRouter)
app.use('/api/organizations', organizationsRouter)
app.use('/api/networks', networksRouter)
app.use('/api/appointments', appointmentsRouter)
app.use('/api/medicine-groups', medicineGroupsRouter)
app.use('/api/medicines', medicinesRouter)
app.use('/api/batches', batchesRouter)
app.use('/api/barcode', barcodeRouter)
app.use('/api/medical-records', medicalRecordsRouter)
app.use('/api', mockUsersRouter)

app.get('/health', (_req, res) => res.json({ ok: true }))

async function start() {
  try {
    await connectDb()
    // run seed only once if collections empty
    await seedDatabase()

    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Startup error', err)
    process.exit(1)
  }
}

start()