import Sequelize from 'sequelize'
import defineUser from './models/user';

export default function initSequelizeFromConfig(config) {
    const sequelize = new Sequelize(config.postgres.uri, {
        dialect: 'postgres',
    })
    const models = {
        User: defineUser(sequelize),
    }

    return { sequelize, models }

}
