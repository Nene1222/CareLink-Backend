import { Router } from 'express'
import { BatchController } from '../../controllers/medical/batchController'

const router = Router()
const controller = new BatchController()

// Get batches by medicine (must be before :id route)
router.get('/medicines/:medicineId/batches', (req, res) => controller.getByMedicine(req, res))

// Standard CRUD operations
router.get('/', (req, res) => controller.getAll(req, res))
router.post('/', (req, res) => controller.create(req, res))

// Get/Update/Delete by ID (must be last)
router.get('/:id', (req, res) => controller.getById(req, res))
router.put('/:id', (req, res) => controller.update(req, res))
router.delete('/:id', (req, res) => controller.delete(req, res))

export default router

