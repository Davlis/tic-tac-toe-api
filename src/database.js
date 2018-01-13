import Sequelize from 'sequelize'
import defineUser from './models/user'
import defineRoom from './models/room'
import defineStat from './models/stat'

export default function initSequelizeFromConfig(config) {
	const sequelize = new Sequelize(config.postgres.uri, {
	   dialect: 'postgres',
	})
	const models = {
	   User: defineUser(sequelize),
	   Room: defineRoom(sequelize),
     Stat: defineStat(sequelize),
	}

	return { sequelize, models }
}
