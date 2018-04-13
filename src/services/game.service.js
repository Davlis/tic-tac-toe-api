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
    for (let i = 0; i < lines.length; ++i) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
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

export async function emitWin(socket) {
    socket.emit('gameWin')
}

export async function emitLose(socket) {
    socket.emit('gameLose')
}

export async function emitDraw(sockets) {
    sockets.emit('gameDraw')
}

export async function endGameHandler(options, sockets) {
    const { type, userId, nextUserId, Stat } = options;

    const userStat = await Stat.findOne({ where: { fkUserId: userId } })
    const nextUserStat = await Stat.findOne({ where: { fkUserId: nextUserId } })

    if (type === 'win') {
        userStat.win += 1
        userStat.ratio = userStat.win / userStat.lost
        nextUserStat.lost += 1
        nextUserStat.ratio = nextUserStat.win / nextUserStat.lost
        await userStat.save()
        await nextUserStat.save()
        emitWin(sockets[0])
        emitLose(sockets[1])
    } else if (type === 'draw') {
        userStat.draw += 1
        nextUserStat.draw += 1
        await userStat.save()
        await nextUserStat.save()
        emitDraw(sockets)
    }
}
