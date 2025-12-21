import { Router } from 'express'
import { MedicineController } from '../../controllers/medical/medicineController'
import { uploadBarcode } from '../../utils/upload'
const router = Router()
const controller = new MedicineController()

// Standard CRUD operations (must be before specific routes)
router.get('/', (req, res) => controller.getAll(req, res))
router.post('/', uploadBarcode.single('barcode_image'), (req, res) => controller.create(req, res))

// Get medicines by group name (specific routes before :id)
router.get('/group/:groupName', (req, res) => controller.getByGroup(req, res))
router.get('/group-id/:groupId', (req, res) => controller.getByGroupId(req, res))

// Get/Update/Delete by ID (must be last)
router.get('/:id', (req, res) => controller.getById(req, res))
router.put('/:id', uploadBarcode.single('barcode_image'), (req, res) => controller.update(req, res))
router.delete('/:id', (req, res) => controller.delete(req, res))

export default router
