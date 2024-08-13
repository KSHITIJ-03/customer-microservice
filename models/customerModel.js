const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const customerSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'customer name is required']
    },
    email : {
        type : String,
        required : [true, 'customer email is required'],
        unique : [true, 'user exists'],
        validate : [validator.isEmail, 'email should be of correct form']
    },
    password : {
        type : String,
        required : [true, 'password is required'],
        minLength : [8, 'password must be of atleast 8 characters long'],
        select : false
    },
    confirmPassword : {
        type : String,
        required : [true, 'password confirmation is required'],
        validate : {
            validator : function(val){
                return this.password === val
            },
            message : 'password and confirm passwords should match each other'
        }
    },
    passwordChangedAt : {
        type : Date
    },
    admin : {
        type : Boolean,
        default : false,
        select : false
    },
    cart: [
        {
            product : {
                _id : {type : String, required : [true, 'product id is required']},
                name : String,
                price : Number
            },
            unit : Number,
            price : Number
        }
    ],
    wishlist:[
        {
            product : {
                _id : {type : String, required : [true, 'product id is required']},
                name : String,
                available : Boolean,
                description : String,
                price : Number
            }
        }
    ],
    orders: [ 
        {
            _id : {type : String, required : [true, 'order id is required']},
            amount : Number,
            date : {type : Date, default : Date.now()}
        }
    ],
    address : [
        {
            type : mongoose.Schema.Types.ObjectId, ref : 'Address'
        }
    ]
},
{
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
})

// customerSchema.virtual('price').get(function(){
//     let price = 0
//     for(let i = 0; i < this.cart.length; i++){
//         price = this.cart.product.price + price
//     }
//     this.price = price
// })

customerSchema.pre('save', async function(next){
    this.confirmPassword = undefined
    if(!this.isModified("password")) return next()
    this.password = await bcryptjs.hash(this.password, 12)
    next()
})

customerSchema.pre("save", function(next){
    if(!this.isModified("password") || this.isNew) return next()
    this.passwordChangedAt = Date.now() - 1000
    next()
})

customerSchema.methods.passwordChange = function(jwtTokenTime) {
    //console.log(jwtTokenTime, Date.now() + 1000);
    if(this.passwordChangedAt) {
        return jwtTokenTime < Date.parse(this.passwordChangeTime)/1000
        //console.log(jwtTokenTime, Date.now() + 1000);
        return jwtTokenTime < Date.now() + 1000
    }
    return false
}

customerSchema.methods.correctPassword = async (candidatePassword, userPassword) => {
    //if(this.passwordChangedAt > Date.now())
    return await bcryptjs.compare(candidatePassword, userPassword)
}


module.exports = mongoose.model('Customer', customerSchema)