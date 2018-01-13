import { assertOrThrow } from '../utils'

export async function createRoom(req, res) {
    res.send('NOT IMPLEMENTED.')
}

export async function joinRoom(req, res) {
    res.send('NOT IMPLEMENTED.')
}

export async function leaveRoom(req, res) {
    res.send('NOT IMPLEMENTED.')
}

export async function getInvitationLink(req, res) {
    res.send('NOT IMPLEMENTED.')
}

export async function getPublicRooms(req, res) {

    const { Room } = req.app.get('models')

    const rooms = await Room.findAll({
        type: Room.ROOM_TYPES.PUBLIC,
    })

    res.send(rooms)
}

export async function removeRoom(req, res) {
    res.send('NOT IMPLEMENTED.')
}

export async function startGame(req, res) {
    res.send('NOT IMPLEMENTED.')
}
