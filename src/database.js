import Sequelize from 'sequelize'
import defineUser from './models/user'
import defineRoom from './models/room'
import defineStat from './models/stat'
import defineUserConnection from './models/userConnection'
import defineGame from './models/game'

export default function initSequelizeFromConfig(config) {

	const sequelize = new Sequelize(config.postgres.uri, {
	   dialect: 'postgres',
     logging: false,
	})

	const models = {
        User: defineUser(sequelize),
        Room: defineRoom(sequelize),
        Stat: defineStat(sequelize),
        UserConnection: defineUserConnection(sequelize),
        Game: defineGame(sequelize),
	}

  Object.keys(models).forEach((name) => {
    if ('associate' in models[name]) {
      models[name].associate(models)
    }
  })

	return { sequelize, models }
}
