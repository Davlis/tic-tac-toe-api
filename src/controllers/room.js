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

    const ownerInformation = await User.findById(user.id)

    req.app.io.emit('roomCreated', {room, ownerInformation})
    res.send(room)
}

export async function joinRoom(req, res) {

    const { roomId } = req.params

    const room = await Room.findById(roomId)

    assertOrThrow(room, Error, 'Room not found')
    assertOrThrow(!room.isFull, Error, 'Room is full')

    req.app.io.emit('joinRoom', roomId)
    res.send('ok')
}

export async function leaveRoom(req, res) {

    const { roomId } = req.params

    const room = await Room.findById(roomId)

    assertOrThrow(room, Error, 'Room not found')

    room.isFull = false

    room.save()

    req.app.io.emit('leaveRoom', roomId)
    res.send('ok')
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

    const sequelize = req.app.get('sequelize')
    const { User, Room } = req.app.get('models')
    const { user } = res.locals

    const { roomId } = req.params

    const room = await Room.findById(roomId)

    assertOrThrow(room, Error, 'Room not found')

    await room.destroy()

    req.app.io.emit('roomRemove', {room})

    res.send('ok')
}

export async function startGame(req, res) {
    res.send('NOT IMPLEMENTED.')
}
