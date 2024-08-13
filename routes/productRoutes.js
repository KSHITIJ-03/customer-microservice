const customerController = require('./../controllers/customerController')
const shoppingRouter = require('./shoppingRouter')

const express = require('express')
const router = express.Router()

router.use('/:id/cart', shoppingRouter)

module.exports = router