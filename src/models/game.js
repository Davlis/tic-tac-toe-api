import { DataTypes } from 'sequelize'

const SCHEMA = {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    roomId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'rooms',
            key: 'id',
        },
    },
    states: {
        type: DataTypes.JSON,
    },
    ownerAck: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    guestAck: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}

export default function(sequelize) {
    const Game = sequelize.define('game', SCHEMA)

    Game.associate = function({ User, Room }) {
        Game.belongsTo(Room, { foreignKey: 'roomId',  as: 'room'})
    }

    return Game
}
