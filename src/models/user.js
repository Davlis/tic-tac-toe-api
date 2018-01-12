import { DataTypes } from 'sequelize'
import { createHmac } from 'crypto'
import jwt from 'jsonwebtoken'

const SCHEMA = {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    },
    passhash: {
        type: DataTypes.STRING(128),
        allowNull: true,
        get() { return undefined },
    },
    email: {
        type: DataTypes.STRING(511),
        allowNull: false,
        unique: true,
        validate: {
            len: [5, 512],
            isEmail: true,
            forbiddenCharacters(val) {
                if (/[&=<>+,]/.test(val)) {
                    throw Error('Email contains forbidden characters')
                }
            },
            noTwoDotsInARow(val) {
                if (val.includes('..')) {
                    throw Error('Email can\'t have two dots in a row')
                }
            },
        },
    }
}

export default function(sequelize) {
    const User = sequelize.define('user', SCHEMA);
    User.sync()

    User.hashPassword = (password, salt) => {
        return createHmac('sha512', salt)
            .update(password)
            .digest('hex')
    }

    User.getAuthToken = (email, salt) => {
        return jwt.sign({
            email,
        }, salt)
    }

    return User
}
