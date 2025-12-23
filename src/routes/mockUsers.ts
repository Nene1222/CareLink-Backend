import { Router } from 'express'
import { MockUsersController } from '../controllers/mockUsersController'

const router = Router()
const controller = new MockUsersController()

// GET /api/doctors - Get list of doctors for dropdown
router.get('/doctors', (req, res) => controller.getDoctors(req, res))

// GET /api/patients - Get list of patients for dropdown
router.get('/patients', (req, res) => controller.getPatients(req, res))

export default router

