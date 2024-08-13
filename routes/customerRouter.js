const express = require('express')
const router = express.Router()
const customerController = require('./../controllers/customerController')

router.route('/signup').post(customerController.signup)
router.route('/login').post(customerController.login)
router.route('/orders').get(customerController.protect, customerController.order)
router.route('/address').post(customerController.protect, customerController.addAddress)
router.route('/profile').get(customerController.protect, customerController.getProfile)

module.exports = router