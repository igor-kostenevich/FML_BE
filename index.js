require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const http = require('http')
const cors = require('cors')
const morgan = require('morgan')
const { routes } = require('./src/routes')

const PORT = 3000

// Replace from _id to id for mongoDB
mongoose.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  },
});

// Init to DB
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})

// Init app
const app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Use routes
routes.forEach(item => {
  app.use(`/api/v1/${item}`, require(`./src/routes/${item}`))
})

// Start server
http.createServer({}, app).listen(PORT)
console.log(`Server running at ${PORT}`)
