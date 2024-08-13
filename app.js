const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
dotenv.config({path : './config.env'})
const app = express()

const customerRouter = require('./routes/customerRouter')
const productRouter = require('./routes/productRoutes')
const shoppingRouter = require('./routes/shoppingRouter')
const errorController = require('./controllers/errorController')
const appEventController = require('./controllers/appEventController')
const appError = require("./utils/appError")

app.use(express.json())
app.use(morgan("dev"))

// customer ---------------
// post signup/signin
// wishlist - get post del
// address - post put delete

app.use('/api/v1/customer', customerRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/shopping', shoppingRouter)

app.use('/app-events', appEventController)

app.get('/', (req, res) => {
    res.json({
        msg : 'hello from the server'
    })
})

app.all("*", (req, res, next) => {
    next(new appError(`can't find ${req.originalUrl} on this server`, 404))
})

app.use(errorController)

module.exports = app