import { assertOrThrow } from '../utils'

export async function getStats(req, res) {
    const sequelize = req.app.get('sequelize')
    const { Stat, User } = req.app.get('models')

    const stats = await Stat.findAll({
        include: [User]
    })

    res.send(stats)
}

export async function createUserStat(user, transaction) {
    await Stat.create({
        fkUserId: user.id,
    }, { transaction })
}
