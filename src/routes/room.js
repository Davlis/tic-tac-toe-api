import { Router } from 'express'
import { errorWrap } from '../utils'
import * as roomController from '../controllers/room'

const router = Router();

router.post('/', errorWrap(roomController.createRoom))
router.get('/:id', errorWrap(roomController.getRoom))
router.post('/join', errorWrap(roomController.joinRoom))
router.post('/leave', errorWrap(roomController.leaveRoom))
router.get('/link', errorWrap(roomController.getInvitationLink))
router.get('/', errorWrap(roomController.getPublicRooms))
router.delete('/:id', errorWrap(roomController.removeRoom))
router.post('/:id/game', errorWrap(roomController.startGame))

export default router
