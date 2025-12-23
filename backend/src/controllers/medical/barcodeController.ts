import { Request, Response } from 'express'
import { Medicine } from '../../models/medical/medicine'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { getBarcodeImageUrl } from '../../utils/upload'
export class BarcodeController {
  // POST /barcode/scan
  async scanBarcode(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No barcode image provided' })
      }

      const imagePath = req.file.path
      
      try {
        // Generate image hash for comparison
        const imageHash = await this.generateImageHash(imagePath)

        // Find medicine by comparing with stored barcode images
        const medicine = await this.findMedicineByBarcode(imageHash, imagePath)

        // Clean up uploaded file
        fs.unlinkSync(imagePath)

        if (!medicine) {
          return res.status(404).json({ error: 'No medicine found with matching barcode' })
        }

        return res.json({
          data: {
            medicineId: medicine._id.toString(),
            medicineName: medicine.name,
            groupId: medicine.group_medicine_id.toString()
          }
        })
      } catch (error) {
        // Clean up on error
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
        throw error
      }
    } catch (err) {
      console.error('Error scanning barcode', err)
      return res.status(500).json({ error: 'Failed to scan barcode' })
    }
  }

  // Helper: Generate perceptual hash from image
  private async generateImageHash(imagePath: string): Promise<string> {
    try {
      // Resize image to small size for consistent hashing
      const resized = await sharp(imagePath)
        .resize(16, 16, { fit: 'fill' })
        .greyscale()
        .raw()
        .toBuffer()

      // Generate hash from image data
      const hash = crypto.createHash('md5').update(resized).digest('hex')
      return hash
    } catch (error) {
      console.error('Error generating image hash:', error)
      // Fallback: use file stats
      const stats = fs.statSync(imagePath)
      const metadata = await sharp(imagePath).metadata()
      return `${metadata.width}x${metadata.height}-${stats.size}`
    }
  }

  // Helper: Find medicine by barcode image comparison
  private async findMedicineByBarcode(uploadedHash: string, uploadedImagePath: string): Promise<any> {
    // Get all medicines with barcode images
    const medicines = await Medicine.find({
      barcode_image: { $ne: null },
      deleted_at: null
    }).populate('group_medicine_id', 'group_name').lean()

    let bestMatch: any = null
    let bestSimilarity = 0

    // For each medicine, compare barcode images
    for (const medicine of medicines) {
      if (medicine.barcode_image) {
        // Extract filename from URL path
        const filename = medicine.barcode_image.split('/').pop() || ''
        const barcodePath = path.join(process.cwd(), 'uploads', 'barcodes', filename)
        
        if (fs.existsSync(barcodePath)) {
          // Compare images using similarity
          const similarity = await this.calculateImageSimilarity(barcodePath, uploadedImagePath)
          
          // Keep track of best match
          if (similarity > bestSimilarity) {
            bestSimilarity = similarity
            bestMatch = medicine
          }
        }
      }
    }

    // Return match if similarity is above threshold (85%)
    return bestSimilarity > 0.85 ? bestMatch : null
  }


  // Helper: Calculate image similarity using pixel comparison
  private async calculateImageSimilarity(image1Path: string, image2Path: string): Promise<number> {
    try {
      // Resize both images to same size for comparison
      const size = 32
      const image1 = await sharp(image1Path)
        .resize(size, size, { fit: 'fill' })
        .greyscale()
        .raw()
        .toBuffer()
      
      const image2 = await sharp(image2Path)
        .resize(size, size, { fit: 'fill' })
        .greyscale()
        .raw()
        .toBuffer()

      // Calculate similarity based on pixel differences
      let matches = 0
      const totalPixels = image1.length
      
      for (let i = 0; i < totalPixels; i++) {
        const diff = Math.abs(image1[i] - image2[i])
        // Consider pixels similar if difference is less than 10
        if (diff < 10) {
          matches++
        }
      }

      return matches / totalPixels
    } catch (error) {
      console.error('Error calculating similarity:', error)
      return 0
    }
  }
}

