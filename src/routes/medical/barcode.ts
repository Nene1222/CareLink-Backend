import { Router } from 'express'
import { BarcodeController } from '../../controllers/medical/barcodeController'
import { uploadBarcode } from '../../utils/upload'

const router = Router()
const controller = new BarcodeController()

// POST /barcode/scan - Scan barcode from uploaded image
router.post('/scan', uploadBarcode.single('barcode_image'), (req, res) => controller.scanBarcode(req, res))

export default router

