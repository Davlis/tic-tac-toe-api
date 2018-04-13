export default async function storeClientId(socket, models, clientId) {
    const { UserConnection } = models
    try {
        await UserConnection.create({
            socketId: socket.id,
            userId: clientId,
        })
    } catch (err) {
        console.error(err)
    }
}
