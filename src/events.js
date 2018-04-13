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
            } catch (err) {
                console.error(err)
            }
        })

        socket.on('roomLeave', id => {
            console.log(id);
            socket.leave(id)
        })

        socket.on('disconnect', async () => {
            const { UserConnection, Room, Game } = models
            
            console.log('on disconnect')

            try {
                const user = await UserConnection.find({ where: { socketId: socket.id}})

                if (!user) {
                    return
                }

                await user.destroy()

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


                if  (roomOwned || roomJoined) {
                    const roomId = roomOwned.id || roomJoined.id
                    io.sockets.in(roomId).emit('gameLeft')
                }

            } catch(err) {
                console.error(err)
            }
        })

    })
}