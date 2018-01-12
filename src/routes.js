import { Router } from 'express'

import Authenticate from './middleware/authenticate'
import authRoutes from './routes/auth'

const router = Router();

router.use('/auth', authRoutes)

export default router
