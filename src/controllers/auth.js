import { assertOrThrow } from '../utils'

export async function login(req, res) {

    const config = res.app.get('config')
    const { email, password } = req.body
    const { User } = req.app.get('models')

    const user = await User.find({
        where: {
            email: email,
        },
    })

    assertOrThrow(user, Error, 'User not found')

    assertOrThrow(
        user.getDataValue('passhash') === User.hashPassword(password, config.salt),
        Error,
        'Invalid password')

    const token = User.getAuthToken(user.id, config.salt)

    res.send({ user, token })
}

export async function register(req, res) {

    const sequelize = req.app.get('sequelize')
    const config = res.app.get('config')
    const { email, nickname, password, } = req.body
    const { User, Stat } = req.app.get('models')

    const transaction = await sequelize.transaction()

    const passhash = User.hashPassword(password, config.salt)

    const user = await User.create({
        email,
        nickname,
        password,
        passhash,
    }, { transaction })

    await Stat.create({
        fkUserId: user.id,
    }, { transaction })

    await transaction.commit()

    res.send(user)
}
