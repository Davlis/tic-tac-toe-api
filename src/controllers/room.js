import { assertOrThrow, pick } from '../utils'

export async function createRoom(req, res) {

    const sequelize = req.app.get('sequelize')
    const { User, Room, Stat } = req.app.get('models')
    const { user } = res.locals

    const input = pick(req.body, 'name type')

    const room = await Room.create({
        name: input.name,
        type: input.type,
        fkOwner: user.id,
    })

    req.app.io.emit('NEW ROOM')

    res.send(room)
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

    const { Room, User } = req.app.get('models')

    const rooms = await Room.findAll({
        type: Room.ROOM_TYPES.PUBLIC,
        include: [User,],
    })

    res.send(rooms)
}

export async function removeRoom(req, res) {
    res.send('NOT IMPLEMENTED.')
}

export async function startGame(req, res) {
    res.send('NOT IMPLEMENTED.')
}
