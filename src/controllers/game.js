import { assertOrThrow } from '../utils'

export async function checkWinner() {
}

export async function canMove(req, res) {
}

export async function acknowledge(req, res) {

    const { User, Room, Game } = req.app.get('models')
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
        const socketIds = Object.keys(req.app.io.sockets.sockets)
        req.app.io.sockets.sockets[socketIds[0]].emit('playerMove') // this should be owner
    }

    res.send({status: 'ok'})
}