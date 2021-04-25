// DONT CHANGE
const express = require('express')
const cors = require('cors')
const path = require('path')
const expressSession = require('express-session')

const app = express()
const http = require('http').createServer(app)

const session = expressSession({
    secret: 'coding is amazing',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
})
// Express App Config
app.use(express.json())
app.use(session)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'build')))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000','http://10.0.0.6:3000'],
        credentials: true
    }
    app.use(cors(corsOptions))
}
const {connectSockets} = require('./services/socket.service')

const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
app.all('*', setupAsyncLocalStorage)

// TODO: check with app.use
app.get('/api/setup-session', (req, res) =>{
    req.session.connectedAt = Date.now()
    // console.log('setup-session:', req.sessionID);
    res.end()
})

//CHANGE
const gameRoute = require('./api/game/game.routes')
app.use('/api/game', gameRoute)
// STOP CHANGE


connectSockets(http, session)

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const logger = require('./services/logger.service')
const port = process.env.PORT || 3030
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})




