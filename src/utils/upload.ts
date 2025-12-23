// import multer from 'multer'
// import path from 'path'
// import fs from 'fs'

// // Ensure uploads directory exists
// const uploadsDir = path.join(process.cwd(), 'uploads', 'barcodes')
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true })
// }

// // Configure storage
// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, uploadsDir)
//   },
//   filename: (_req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, 'barcode-' + uniqueSuffix + path.extname(file.originalname))
//   }
// })

// // File filter - only images
// const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true)
//   } else {
//     cb(new Error('Only image files are allowed'))
//   }
// }

// export const uploadBarcode = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB limit
//   }
// })

// // Helper to get file URL/path for storage in DB
// export const getBarcodeImageUrl = (filename: string | null | undefined): string | null => {
//   if (!filename) return null
//   // Store the filename - it will be served from /uploads/barcodes/{filename}
//   return filename
// }

import multer from 'multer'
import path from 'path'
import fs from 'fs'
import type { Request } from 'express'

const uploadsBaseDir = path.join(process.cwd(), 'uploads')
const barcodeDir = path.join(uploadsBaseDir, 'barcodes')
const productDir = path.join(uploadsBaseDir, 'products')

// Ensure upload directories exist
for (const dir of [uploadsBaseDir, barcodeDir, productDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Configure storage for both barcode and product images
const storage = multer.diskStorage({
  destination: (_req: Request, file: Express.Multer.File, cb) => {
    const targetDir = file.fieldname === 'photo' ? productDir : barcodeDir
    cb(null, targetDir)
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const prefix = file.fieldname === 'photo' ? 'product-' : 'barcode-'
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname))
  }
})

// File filter - only images
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
})

// Reuse the same multer instance for barcode-only or mixed uploads
export const uploadBarcode = upload
export const uploadMedicineImages = upload

// Helper to get file URL/path for storage in DB
export const getBarcodeImageUrl = (
  filename: string | null | undefined
): string | null => {
  if (!filename) return null
  return `barcodes/${filename}`
}

export const getProductImageUrl = (
  filename: string | null | undefined
): string | null => {
  if (!filename) return null
  return `products/${filename}`
}
