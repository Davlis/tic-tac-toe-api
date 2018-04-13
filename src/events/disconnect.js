export default async function disconnect(models) {
    const { UserConnection, Room, Game } = models

    try {
        const user = await UserConnection.find({ where: { socketId: socket.id } })

        if (!user) {
            return
        }

        await user.destroy()

        const roomOwned = await Room.find({ where: { fkOwner: user.userId } })

        if (roomOwned) {
            await roomOwned.destroy()
            console.log(roomOwned.id)
            io.sockets.in(roomOwned.id).emit('roomDestroy')
        }

        const roomJoined = await Room.find({ where: { fkGuest: user.userId } })

        if (roomJoined) {
            roomJoined.isFull = false
            roomJoined.fkGuest = null
            await roomJoined.save()
            io.sockets.in(roomJoined.id).emit('roomLeave', user)
        }
    } catch (err) {
        console.error(err)
    }
}
