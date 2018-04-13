import { DataTypes } from 'sequelize'

const SCHEMA = {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    socketId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },        
    }
}

export default function(sequelize) {
    const UserConnection = sequelize.define('user_connections', SCHEMA)

    UserConnection.sync({force: true})

    UserConnection.associate = function({ User }) {
        UserConnection.belongsTo(User, { foreignKey: 'userId' })
    }

    return UserConnection
}
