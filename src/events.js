export default async function initialize(io) {

    const rooms = []

    io.on('connection', socket => {

        socket.on('roomJoin', data => {
            socket.join(data.room)
            io.sockets.in(data.room).emit('roomJoin', data.user)
        })

        socket.on('roomLeave', id => {
            socket.leave(id)
        })

    })
}