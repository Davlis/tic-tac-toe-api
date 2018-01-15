import { assertOrThrow, pick } from '../utils'

export async function createRoom(req, res) {

    const { User, Room, Stat } = req.app.get('models')
    const { user } = res.locals

    const input = pick(req.body, 'name type')

    const room = await Room.create({
        name: input.name,
        type: input.type,
        fkOwner: user.id,
    })

    const ownerInformation = await User.findById(user.id, {include: [Stat]})

    req.app.io.emit('roomCreated', {room, ownerInformation})
    res.send(room)
}

export async function getRoom(req, res) {
    const { User, Room, Stat } = req.app.get('models')
    const { id } = req.params
    const { user } = res.locals

    let room = await Room.findById(id, {include: [User]})

    assertOrThrow(room, Error, 'Room not found')

    const stats = await Stat.getStatsByUserId(user.id)

    room = JSON.parse(JSON.stringify(room))
    room.user.stats = stats

    res.send(room)
}

export async function joinRoom(req, res) {
    const { Room } = req.app.get('models')
    const { roomId } = req.params
    const { user } = res.locals
    const { socketId } = req.body

    const room = await Room.findById(roomId)

    assertOrThrow(room, Error, 'Room not found')
    assertOrThrow(!room.isFull, Error, 'Room is full')

    let socket

    for (const _socketId in req.app.io.sockets.sockets) {
        if (socketId === _socketId) {
            socket = req.app.io.sockets.sockets[_socketId]
            break
        }
    }

    socket.join(roomId)
    req.app.io.sockets.in(roomId).emit('roomJoin', user)
    res.send('ok')
}

export async function leaveRoom(req, res) {

    const { Room, User } = req.app.get('models')
    const { roomId } = req.body
    const { user } = res.locals

    const room = await Room.findById(roomId)

    assertOrThrow(room, Error, 'Room not found')

    if (room.fkOwner.toString() === user.id.toString()) {
        await room.destroy()

        req.app.io.sockets.in(roomId).emit('roomDestroy', roomId)
        res.send('ok')
    } else {
        room.isFull = false

        await room.save()

        req.app.io.sockets.in(roomId).emit('roomLeave', user)
        res.send('ok')
    }
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
