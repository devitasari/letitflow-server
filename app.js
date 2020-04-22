if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

//setup mongoose
const mongoose = require('mongoose')
const MONGO_URI =process.env.MONGO_URI

mongoose.connect(MONGO_URI, { 
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to mongodb!')
  })
  .catch(() => {
    console.log('Failed connect to mongodb!')
  })

//setup express
const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const { errorHandler } = require('./middlewares/errorHandler')
const cron = require('./helpers/cronJob')
const morgan = require('morgan')


const app = express()
const PORT = process.env.PORT || 3000


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(morgan('dev'))

cron()

app.use('/', routes)
app.use(errorHandler)

app.listen(PORT, () => console.log('Listening on port', PORT))
