///////////////////////////////////// SEQULIZE ///////////////////////////////////////
// const Sequelize = require('sequelize')
// const sequelize = require('../util/database')

// const Order = sequelize.define('orders', {
//     id: {
//         type:Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         autoNull: false
//     }
// })

// module.exports = Order

///////////////////////////////////// MONGOOSE /////////////////////////////////////////////

const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
    {
        showenId:{
            type:Number,
            require: true
        },
        products:[{
          productId:{
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Product'
          },
          quantity:{
            type: Number,
            required: true
          }
        }],
        userId: {
            type:mongoose.Types.ObjectId,
            ref: 'User'
          }
    }
)
module.exports =  mongoose.model('Order', orderSchema)