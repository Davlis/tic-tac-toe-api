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

        console.log(room.fkOwner)

        const ownerUserConnection = await UserConnection.find({where: {userId: room.fkOwner}})

        console.log('ownerUserConnection', ownerUserConnection.socketId)

        req.app.io.sockets.sockets[ownerUserConnection.socketId].emit('playerMove') // this should be owner
    }

    res.send({status: 'ok'})
}