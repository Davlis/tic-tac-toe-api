import { DataTypes } from 'sequelize'

const SCHEMA = {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    win: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    lost: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    ratio: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
    },
    fkUserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
}

export default function(sequelize) {
    const Stats = sequelize.define('stats', SCHEMA);
    Stats.sync()

    Stats.associate = function({ User }) {
        Stats.belongsTo(User, { foreignKey: 'fkUserId' })
    }

    return Stats
}
