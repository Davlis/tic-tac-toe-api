import express from 'express'
import io from 'socket.io'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import http from 'http'
import router from './routes'
import initEvents from './events'
import generateConfig from './config'
import initSequelize from './database'

process.on('unhandledRejection', console.error)

const config = generateConfig()
const { sequelize, models } = initSequelize(config)

const depedencies = { sequelize, models }

const app = initApp(config, depedencies)

const server = http.createServer(app)

const _io = io.listen(server)

app.io = _io

server.listen(config.port, () => {

    initEvents(_io, depedencies)

    console.log(`App listening on port ${config.port}!`)
})

export default function initApp(config, depedencies) {
    const app = express()

    app.set('config', config)
    app.set('models', depedencies.models)
    app.set('sequelize', depedencies.sequelize)

    app.use(morgan('dev'))

    app.use(cors({ origin: true }))

    app.use(bodyParser.urlencoded({ limit: '12mb',
        extended: false,
        parameterLimit: 1000000 }))
    app.use(bodyParser.json({ limit: '12mb' }))

    app.use(router)

    app.use((err, req, res, next) => {
        res.status(err.status || 500).json({
            statusCode: err.status || 500,
            error: err.name,
            message: err.message,
        })
    })
    app.use((req, res) => {
        res.status(404).json({
            statusCode: 404,
            error: 'Not Found',
            message: 'No such route',
        })
    })

    //depedencies.sequelize.sync({force: true})

    return app;
}
