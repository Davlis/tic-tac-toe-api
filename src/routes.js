import { Router } from 'express'

import Authenticate from './middleware/authenticate'
import authRoutes from './routes/auth'
import roomRoutes from './routes/room'

const router = Router();

router.use('/auth', authRoutes)
router.use('/room', Authenticate, roomRoutes)

export default router
