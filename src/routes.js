import { Router } from 'express'

import Authenticate from './middleware/authenticate'
import authRoutes from './routes/auth'
import roomRoutes from './routes/room'
import statRoutes from './routes/stat'

const router = Router();

router.use('/auth', authRoutes)
router.use('/room', Authenticate, roomRoutes)
router.use('/stat', Authenticate, statRoutes)

export default router
