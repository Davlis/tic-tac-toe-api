export default async function initialize(io) {

    const rooms = []

    io.on('connection', socket => {

        socket.on('roomLeave', id => {
            socket.leave(id)
        })

        socket.on('disconnect', () => {
          console.log('user disconnected')
        })

    })
}