import { Router } from 'express'
import { MedicalRecordController } from '../../controllers/medicalRecord/medicalRecordController'
import { auth } from '../../middleware/auth'

const router = Router()
const controller = new MedicalRecordController()

// Get by recordId (must be before :id route)
router.get('/record-id/:recordId', auth, (req, res) => controller.getByRecordId(req, res))

// Standard CRUD operations
router.get('/', auth, (req, res) => controller.getAll(req, res))
router.get('/:id', auth, (req, res) => controller.getById(req, res))
router.post('/', auth, (req, res) => controller.create(req, res))
router.put('/:id', auth, (req, res) => controller.update(req, res))
router.delete('/:id', auth, (req, res) => controller.delete(req, res))

export default router

 