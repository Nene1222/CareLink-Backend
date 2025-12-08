import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import attendanceRouter from './features/attendance/routes/attendance'
import organizationsRouter from './routes/organizations'
import networksRouter from './routes/networks'
import appointmentsRouter from './features/appointment/routes/appointments'
import { connectDb } from './db'
import { seedDatabase } from './seed' // <-- new

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT || 3000)

app.use(cors())
app.use(express.json())

app.use('/api/attendance', attendanceRouter)
app.use('/api/organizations', organizationsRouter)
app.use('/api/networks', networksRouter)
app.use('/api/appointments', appointmentsRouter)

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