import dotenv from 'dotenv'
dotenv.config()
import { connectDb } from './db'
import { seedDatabase } from './seed'

async function run() {
  try {
    await connectDb()
    await seedDatabase()
    console.log('Seed complete')
    process.exit(0)
  } catch (err) {
    console.error('Seed failed', err)
    process.exit(1)
  }
}

run()

//to show about seeding fail or success on terminal