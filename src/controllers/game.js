import { assertOrThrow } from '../utils'
import { checkWinner, checkDraw, endGameHandler } from '../services/game.service'

export async function newState(req, res) {
    const { User, Room, Game, UserConnection, Stat } = req.app.get('models')
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
        nextUserSocket = await UserConnection.find({ where: { userId: room.fkOwner } })
    } else {
        nextUserSocket = await UserConnection.find({ where: { userId: room.fkGuest } })
    }

    const endGameOptions = {
        userId: user.id,
        nextUserId: nextUserSocket.userId,
        Stat
    }

    if (checkWinner(state)) {
        const winnerSocket = await UserConnection.find({ where: { userId: user.id } })
        endGameOptions.type = 'win'
        endGameHandler(endGameOptions, 
            [
                req.app.io.sockets.sockets[winnerSocket.socketId],
                req.app.io.sockets.sockets[nextUserSocket.socketId]
            ]
        )
    } else if (checkDraw(state)) {
        endGameOptions.type = 'draw'
        endGameHandler(endGameOptions, req.app.io.sockets.in(room.id))
    } else {
        req.app.io.sockets.sockets[nextUserSocket.socketId].emit('playerMove')
    }

    res.send({ status: 'ok' })
}

export async function acknowledge(req, res) {
    const sequelize = req.app.get('sequelize')
    const { User, Room, Game, UserConnection } = req.app.get('models')
    const { gameId } = req.params
    const { user } = res.locals

    const transaction = await sequelize.transaction({
        isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITED,
        lock: sequelize.Transaction.LOCK.KEY_SHARE
    })

    const game = await Game.findById(gameId, { transaction })
    assertOrThrow(game, Error, 'Game not found')

    const room = await Room.findById(game.roomId, { transaction })
    assertOrThrow(room, Error, 'Room not found')

    if (room.fkOwner.toString() === user.id.toString()) {
        game.ownerAck = true
    } else if (room.fkGuest.toString() === user.id.toString()) {
        game.guestAck = true
    } else {
        assertOrThrow(false, Error, 'Unathorized')
    }

    await game.save({ transaction })

    await transaction.commit()

    if (game.ownerAck === true) {
        const ownerUserConnection = await UserConnection.findOne({ 
                where: { userId: room.fkOwner },
                order: [['createdAt', 'DESC']],
            })
        req.app.io.sockets.sockets[ownerUserConnection.socketId].emit('playerMove') // this should be owner
    }

    res.send({ status: 'ok' })
}
