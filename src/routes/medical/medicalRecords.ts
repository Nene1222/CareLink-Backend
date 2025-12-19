import { Router } from 'express'
import { MedicalRecordController } from '../../controllers/medicalRecord/medicalRecordController'

const router = Router()
const controller = new MedicalRecordController()

// Get by recordId (must be before :id route)
router.get('/record-id/:recordId', (req, res) => controller.getByRecordId(req, res))

// Standard CRUD operations
router.get('/', (req, res) => controller.getAll(req, res))
router.get('/:id', (req, res) => controller.getById(req, res))
router.post('/', (req, res) => controller.create(req, res))
router.put('/:id', (req, res) => controller.update(req, res))
router.delete('/:id', (req, res) => controller.delete(req, res))

export default router

