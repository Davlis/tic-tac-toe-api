import { disconnect, storeClientId } from './events'

export default async function initialize(io, depedencies) {
    const { sequelize, models } = depedencies

    io.on('connection', socket => {
        socket.on('storeClientId', (clientId) => storeClientId(models, clientId))
        socket.on('roomLeave', id => socket.leave(id))
        socket.on('disconnect', () => disconnect(models))
    })
}
