import { Router } from 'express'
import { errorWrap } from '../utils'
import * as roomController from '../controllers/room'

const router = Router();

router.post('/start/:roomId', errorWrap(roomController.startGame))
router.post('/join/:roomId', errorWrap(roomController.joinRoom))
router.post('/', errorWrap(roomController.createRoom))
router.post('/leave', errorWrap(roomController.leaveRoom))
router.get('/link', errorWrap(roomController.getInvitationLink))
router.get('/', errorWrap(roomController.getPublicRooms))
router.delete('/:id', errorWrap(roomController.removeRoom))
router.get('/:id', errorWrap(roomController.getRoom))

export default router
