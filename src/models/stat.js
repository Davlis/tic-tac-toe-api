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
    const Stat = sequelize.define('stats', SCHEMA);

    Stat.associate = function({ User }) {
        Stat.belongsTo(User, { foreignKey: 'fkUserId' })
    }

    Stat.getStatsByUserId = async function(userId) {
        const stat = await Stat.findOne({fkUserId: userId})
        return stat
    }

    return Stat
}
