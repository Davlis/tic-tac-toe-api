export default async function initialize(io) {

    const rooms = []

    io.on('connection', socket => {

        console.log('user connected', socket)

        socket.on('roomLeave', id => {
            console.log('ROOM LEAVE', id);
            socket.leave(id)
        })

        socket.on('disconnect', () => {
          console.log('user disconnected')
        })

    })
}