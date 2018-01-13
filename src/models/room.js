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
        type: DataTypes.ENUM(Object.values(ROOM_TYPES)),
        allowNull: false,
    },
    isFull: {
        type: DataTypes.BOOLEAN,
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
    Room.sync()

    Room.associate = function({ User }) {
        Room.belongsTo(User, { foreignKey: 'fkOwner' })
    }

    Room.ROOM_TYPES = ROOM_TYPES

    return Room
}