import { Router } from 'express'
import { AttendanceController } from '../controllers/attendanceController'

const router = Router()
const controller = new AttendanceController()

router.get('/', (req, res) => controller.getAll(req, res))
router.get('/:id', (req, res) => controller.getById(req, res))
router.post('/', (req, res) => controller.create(req, res))
router.put('/:id', (req, res) => controller.update(req, res))
router.patch('/:id/checkout', (req, res) => controller.checkOut(req, res))
router.patch('/:id/approval', (req, res) => controller.updateApproval(req, res))
router.post('/:id/request-permission', (req, res) => controller.requestPermission(req, res))
router.delete('/:id', (req, res) => controller.delete(req, res))

export default router