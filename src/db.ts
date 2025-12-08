import mongoose from 'mongoose'

export async function connectDb(uri?: string) {
  const mongoUri = uri ?? process.env.MONGODB_URI
  if (!mongoUri) throw new Error('MONGODB_URI not set in environment')

  await mongoose.connect(mongoUri)
  console.log('MongoDB connected')
  return mongoose
}