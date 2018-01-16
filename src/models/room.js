import { DataTypes } from 'sequelize'

const ROOM_TYPES = {
    PRIVATE: 'private',
    PUBLIC: 'public',
}

const SCHEMA = {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isFull: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    fkGuest: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        }
    },
    fkOwner: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
}

export default function(sequelize) {
    const Room = sequelize.define('room', SCHEMA);

    Room.associate = function({ User, Game }) {
        Room.belongsTo(User, { foreignKey: 'fkOwner', as:'owner'})
        Room.belongsTo(User, { foreignKey: 'fkGuest', as:'guest'})
        Room.hasOne(Game, { onDelete: 'cascade' })
    }

    Room.prototype.isOwner = function(userId) {
        return this.fkOwner.toString() === userId.toString()
    }

    Room.ROOM_TYPES = ROOM_TYPES

    return Room
}
