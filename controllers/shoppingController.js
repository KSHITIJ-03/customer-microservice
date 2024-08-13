const Customer = require('./../models/customerModel')
const mongoose = require('mongoose')
const appError = require('./../utils/appError')

async function fillCart (req, res, next) {
    try {

        const customer = await Customer.findById(req.user._id).select('cart')
        const product = {
            _id : req.params.id,
            name : req.body.name,
            price : req.body.price,
        }

        const cartItem = customer.cart.find(item => item.product._id === req.params.id)
        if(cartItem) {
            cartItem.unit += 1
            cartItem.price += product.price
        } else {
            customer.cart.push({
                product : req.params.id, unit : 1,
                price : product.price
            })
        }

        await customer.populate('cart')

        let price = 0

        for(let i = 0; i < customer.cart.length; i++){
            price = customer.cart[i].product.price * customer.cart[i].unit + price
        }

        await customer.save()
        
        res.status(200).json({
            status : 'success',
            customer,
            price
        })
    } catch(err) {
        next(err)
    }
}

async function removeFromCart(req, res, next) {
    try {

        const customer = await Customer.findById(req.user._id).select('cart')
        const product = {
            _id : req.params.id,
            name : req.body.name,
            price : req.body.price,
        }

        const cartItem = customer.cart.find(item => item.product._id === req.params.id)
        if(cartItem && cartItem.unit === 1) {
            customer.cart = customer.cart.filter(item => item.product._id !== cartItem.product._id)
        } else if(cartItem) {
            cartItem.unit -= 1
            cartItem.price -= product.price
        } else {
            return next(new appError('cart is empty or do not have this kind of product', 401))
        }
        await customer.populate('cart')

        let price = 0

        for(let i = 0; i < customer.cart.length; i++){
            price = customer.cart[i].product.price * customer.cart[i].unit + price
        }

        await customer.save()
        
        res.status(200).json({
            status : 'success',
            customer,
            price
        })
    } catch(err) {
        next(err)
    }
}

async function getCart(req, res, next) {
    try {
        const customer = await Customer.findById(req.user._id).populate('cart')
        let price = 0

        for(let i = 0; i < customer.cart.length; i++){
            price = customer.cart[i].product.price * customer.cart[i].unit + price
        }
        res.status(200).json({
            status : 'success',
            message : 'here is your cart',
            price,
            customer
        })
    } catch(err) {
        next(err)
    }
}

module.exports = {fillCart, removeFromCart, getCart}