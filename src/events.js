export default async function initialize(io, depedencies) {

    const { sequelize, models } = depedencies

    io.on('connection', socket => {

        socket.on('storeClientId', async clientId => {
            const { UserConnection } = models
            try {
                await UserConnection.create({
                    socketId: socket.id,
                    userId: clientId,
                })
            } catch(err) {
                console.error(err)
            }
        })

        socket.on('roomLeave', id => {
            socket.leave(id)
        })

        socket.on('disconnect', async () => {
            const { UserConnection, Room } = models
            
            try {
                const user = await UserConnection.find({ where: { socketId: socket.id}})

                const roomOwned = await Room.find({ where: { fkOwner: user.userId}})

                if (roomOwned) {

                    await roomOwned.destroy()
                    io.sockets.in(roomOwned.id).emit('roomDestroy')
                }

                const roomJoined = await Room.find({ where: { fkGuest: user.userId}})

                if (roomJoined) {

                    roomJoined.isFull = false
                    await roomJoined.save()
                    io.sockets.in(roomJoined.id).emit('roomLeave', user)
                }

            } catch(err) {
                console.error(err)
            }
        })

    })
}