const Customer = require('../models/customerModel')
const Address = require('../models/addressModel')
const mongoose = require('mongoose')
const appError = require("../utils/appError")
const jwt = require('jsonwebtoken')

function generateToken(userId) {
    return jwt.sign({id : userId}, process.env.JWT_KEY, {expiresIn : process.env.JWT_EXPIRES})
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_KEY)
}

exports.isAdmin = async (req, res, next) => {
    try {
        console.log(req.user);
        
        if(!req.user.admin) {
            return next(new appError('not permitted', 401))
        }
        next()
    } catch(err) {
        next(err)
    }
}

exports.getProfile = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.user._id).populate('address')
        res.status(200).json({
            status : 'success',
            customer
        })
    } catch (err) {
        next(err)
    }
}

exports.signup = async (req, res, next) => {
    try {
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password
        const confirmPassword = req.body.confirmPassword
        //const admin = req.body.admin
        const customer = await Customer.create({name, email, password, confirmPassword})
        const token = generateToken(customer._id)
        customer.password = undefined
        customer.admin = undefined
        res.status(201).json({
            status : 'success',
            customer,
            token
        })
    } catch(err) {
        next(err)
    }
}

exports.login = async (req, res, next) => {
    try {
        const email = req.body.email
        const password = req.body.password
        
        const user = await Customer.findOne({email}).select('password')

        if(!user) {
            return next(new appError('user not found please signup', 404))
        }
        if(!await user.correctPassword(password, user.password)) {
            return next(new appError('email or password is incorrect', 401))
        }

        const token = generateToken(user._id)
        res.status(200).json({
            status : 'success',
            message : 'user login',
            token
        })

    } catch(err) {
        next(err)
    }
}

exports.protect = async (req, res, next) => {
    try {
        let token
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }

        if(!token) {
            return next(new appError('user logged out', 401))
        }

        const decoded = verifyToken(token)

        if(!decoded) {
            return next(new appError('invalid token', 401))
        }

        const user = await Customer.findById(decoded.id).select('admin')

        if(!user) {
            return next(new appError('user not found', 401))
        }
        
        if(user.passwordChange(decoded.iat)) {
            return next(new appError("user recently change password please login again", 401))
        }

        req.user = user

        console.log(decoded);

        next()
        
    } catch(err) {
        next(err)
    }
}

exports.order = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.user._id).populate('orders')
        res.status(200).json({message : 'your orders', customer})
    } catch(err) {
        next(err)
    }
}

exports.addAddress = async (req, res, next) => {
    try {
        const address = await Address.create(req.body)
        const customer = await Customer.findByIdAndUpdate(req.user._id, {
            $push : {
                address : address._id
            }
        },
        {
            new : true
        })
        res.status(201).json({
            status : 'success',
            message : 'address updated',
            address  
        })

    } catch(err) {
        next(err)
    }
}