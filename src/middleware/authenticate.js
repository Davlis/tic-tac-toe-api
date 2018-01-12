import jwt from 'jsonwebtoken'

export default function authenticate(req, res, next) {
    const config = res.app.get('config')
    const { authorization } = req.headers
    let user

    if (authorization.includes('Bearer ')) {
        const token = authorization.replace('Bearer ', '')
        try {
            user = jwt.verify(token, config.salt)
        } catch(err) {
            throw new Error('Invalid token')
        }

    } else if (authorization.includes('User ')) {
        user = authorization.replace('User ', '')
    } else {
        throw new Error('Authentication error')
    }

    res.locals.user = user
    next()
}
