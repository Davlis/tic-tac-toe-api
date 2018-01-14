import { assertOrThrow } from '../utils'

export async function getStats(req, res) {

    const sequelize = req.app.get('sequelize')
    const { Stat } = req.app.get('models')

    const stats = await Stat.findAll()

    res.send(stats)
}

export async function updateUserStat(req, res) {
    res.send('NOT IMPLEMENTED')
}

export async function createUserStat(req, res) {
    res.send('NOT IMPLEMENTED')
}