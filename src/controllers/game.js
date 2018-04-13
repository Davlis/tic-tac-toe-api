import { assertOrThrow } from '../utils'

export function checkWinner(state) {

    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for(let i=0; i < lines.length; ++i) {
      const [a, b, c] = lines[i];
      if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
}

export function checkDraw(state) {
    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    for (const square of squares) {
        if (!square) {
            return false
        }
    }
    return true
}

export async function canMove(req, res) {
}

export async function emitWin(socket) {
    socket.emit('gameWin')
}

export async function emitLose(socket) {
    socket.emit('gameLose')
}

export async function emitDraw(sockets) {
    sockets.emit('gameDraw')
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

    if (checkWinner(state)) {
        const winnerSocket = await UserConnection.find({where: {userId: user.id}})
        emitWin(req.app.io.sockets.sockets[winnerSocket.socketId])
        emitLose(req.app.io.sockets.sockets[nextUserSocket.socketId])
    } else if (checkDraw(state)) {
        emitDraw(req.app.io.sockets.in(room.id))
    } else {
        req.app.io.sockets.sockets[nextUserSocket.socketId].emit('playerMove')  
    } 

    res.send({status: 'ok'})
}

export async function acknowledge(req, res) {

    try {

        const sequelize = req.app.get('sequelize')
        const { User, Room, Game, UserConnection } = req.app.get('models')
        const { gameId } = req.params
        const { user } = res.locals

        const transaction = await sequelize.transaction({
            isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITED,
            lock: sequelize.Transaction.LOCK.KEY_SHARE
        })

        const game = await Game.findById(gameId, {transaction})

        assertOrThrow(game, Error, 'Game not found')

        const room = await Room.findById(game.roomId, {transaction})

        assertOrThrow(room, Error, 'Room not found')

        if (room.fkOwner.toString() === user.id.toString()) {
            game.ownerAck = true
        } else if (room.fkGuest.toString() === user.id.toString()) {
            game.guestAck = true
        } else {
            assertOrThrow(false, Error, 'Unathorized')
        }

        await game.save({transaction})

        await transaction.commit()

        if (game.ownerAck === true) {

            const ownerUserConnection = await UserConnection.find({ where: { userId: room.fkOwner }});

            req.app.io.sockets.sockets[ownerUserConnection.socketId].emit('playerMove') // this should be owner
        }

        res.send({status: 'ok'})

    } catch (error) {
        console.log(error)
        throw  error;
    }
}
