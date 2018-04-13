export default async function storeClientId(models, clientId) {
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
