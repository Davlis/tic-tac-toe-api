import { Router } from 'express'
import { errorWrap } from '../utils'
import * as gameController from '../controllers/game'

const router = Router();

router.get('/acknowledge/:gameId', errorWrap(gameController.acknowledge))

export default router
