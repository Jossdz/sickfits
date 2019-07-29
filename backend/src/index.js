const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
require('dotenv').config({path: 'variables.env'})

const createServer = require('./createServer')
const db = require('./db')

const server = createServer()

server.express.use(cookieParser())

// TODO decode the jwt

server.express.use((req, res, next) => {
  const {token} = req.cookies
  if (token) {
    const {userId} = jwt.verify(token, process.env.APP_SECRET)
    req.userId = userId
  }
  next()
})
// 2. populate the user on each reques
server.express.use(async (req, res, next) => {
  if (!req.userId) return next()
  const user = await db.query.user(
    {where: {id: req.userId}},
    '{id, permissions, email, name }'
  )
  console.log(user)
  req.user = user
  next()
})

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`server on ${deets.port}`)
  }
)
