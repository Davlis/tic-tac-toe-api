import { Router } from 'express'
import { errorWrap } from '../utils'
import * as statController from '../controllers/stat'

const router = Router();

router.get('/', errorWrap(statController.getStats))

export default router



