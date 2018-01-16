import { assertOrThrow } from '../utils'

export const defaultState = {
  history: [{
    squares: Array(9).fill(null),
  }],
  current: Array(9).fill(null),
  xIsNext: true,
  stepNumber: 0,
  canMove: false,
}

export async function checkWinner() {
}

export async function canMove(req, res) {
}

export async function newState(req, res) {

    const { User, Room, Game, UserConnection } = req.app.get('models')
    const { gameId } = req.params
    const { user } = res.locals
    const { state } = req.body

    const game = await Game.findById(gameId)

    assertOrThrow(game, Error, 'Game not found')

    const room = await Room.find({
        where: {
            id: game.roomId
        },
        include: []
    })

    assertOrThrow(room, Error, 'Room not found')

    req.app.io.sockets.in(room.id).emit('newState', state)

    let nextUserSocket

    if (room.fkGuest === user.id) {
        nextUserSocket = await UserConnection.find({where: {userId: room.fkOwner}})
    } else {
        nextUserSocket = await UserConnection.find({where: {userId: room.fkGuest}})
    }

    req.app.io.sockets.sockets[nextUserSocket.socketId].emit('playerMove')   
    res.send({status: 'ok'})
}

export async function acknowledge(req, res) {

    const { User, Room, Game, UserConnection } = req.app.get('models')
    const { gameId } = req.params
    const { user } = res.locals

    const game = await Game.findById(gameId)

    assertOrThrow(game, Error, 'Game not found')

    const room = await Room.findById(game.roomId)

    assertOrThrow(room, Error, 'Room not found')

    if (room.fkOwner.toString() === user.id.toString()) {
        game.ownerAck = true
    } else if (room.fkGuest.toString() === user.id.toString()) {
        game.guestAck = true
    } else {
        assertOrThrow(false, Error, 'Unathorized')
    }

    await game.save()

    if (game.ownerAck === true && game.guestAck === true) {

        const ownerUserConnection = await UserConnection.find({where: {userId: room.fkOwner}})

        req.app.io.sockets.sockets[ownerUserConnection.socketId].emit('playerMove') // this should be owner
    }

    res.send({status: 'ok'})
}