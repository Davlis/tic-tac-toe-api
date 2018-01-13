import Sequelize from 'sequelize'
import defineUser from './models/user'
import defineRoom from './models/room'

export default function initSequelizeFromConfig(config) {
    const sequelize = new Sequelize(config.postgres.uri, {
        dialect: 'postgres',
    })
    const models = {
        User: defineUser(sequelize),
        Room: defineRoom(sequelize),
    }

    return { sequelize, models }

}
