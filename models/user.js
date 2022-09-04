/** SEQUELIZE */
// const Sequelize = require('sequelize')
// const sequelize = require('../util/database')

// const User = sequelize.define('users', {
//     id: {
//         type:Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         autoNull: false
//     },
//     name: {
//         type:Sequelize.STRING
//     },
//     email: {
//         type:Sequelize.STRING
//     }
// })

// module.exports = User


/** MONGODB */
// const db = require('../util/database')
// const mongodb = require('mongodb');

// module.exports = class User {
//   constructor(name, email, cart, userId) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart // {products:[{...product, quantity:1}], total:45}
//     this.userId = userId
//   }

//   save() {
//     return  db.getDB()
//     .collection('users')
//     .insertOne(this)
//   }
//   static findById(id) {
//     return  db.getDB()
//     .collection('users')
//     .findOne({_id : new mongodb.ObjectId(id)})
//   }
//   static fetchAll() {
//     return db.getDB().collection('users').find().toArray()
//   }

//   getCart() {
//     const interstedProductsIds = this.cart.products.map(product => {
//       return product.productId
//     })
//     return db.getDB().collection('products').find({_id:{$in:interstedProductsIds}}).toArray()
//       .then(interstedProducts => {
//         return interstedProducts.map(interstedProduct => {
//           return {...interstedProduct,
//                   quantity: this.cart.products.find(product => product.productId.equals(interstedProduct._id)).quantity
//           }
//         })
//       })
//   }
//   addToCart(product) {
//     if (!this.cart.products) {
//       this.cart = {products:[]}
//     }
//     // chaeck if product is exsists in the cart
//     const cartItemIndex = this.cart.products.findIndex(pro => {
//       return pro.productId.equals(product._id)
//     })
//     if (cartItemIndex == -1) {
//       // the product is new in the cart
//       const quantity = 1;
//       const newProduct = {productId: product._id, quantity:quantity}
//       this.cart.products = [...this.cart.products, newProduct]
//     } else {
//       // update old product
//       const quantity = this.cart.products[cartItemIndex].quantity + 1
//       const updatedProduct = {productId: product._id, quantity:quantity}
//       this.cart.products[cartItemIndex] = updatedProduct
//     }
//     return db.getDB().collection('users').updateOne({_id : new mongodb.ObjectId(this.userId)}, {$set:{cart: this.cart}})
//   }

//   deleteFromCart(deletedId) {
//     const productIndex = this.cart.products.find(product => product.productId.equals(deletedId))
//     if (productIndex !== -1) {
//       this.cart.products = this.cart.products.filter(product => !product.productId.equals(deletedId))
//     }
//     return db.getDB().collection('users').updateOne({_id : new mongodb.ObjectId(this.userId)}, {$set:{cart: this.cart}})
//   }

//   addOrder() {
//     let orderObj;
//     return this.getCart().then(cartProducts => {
//       orderObj = {
//         showenId: Math.random(),
//         user: {
//           userId: this.userId,
//           name: this.name
//         },
//         products:cartProducts
//       }
//       return db.getDB().collection('orders').insertOne(orderObj).then(_ => {
//         return this.restCart()
//       })
//     })
//   }

//   updateExsistingCart(newCart) {
//     return db.getDB().collection('users').updateOne({_id : new mongodb.ObjectId(this.userId)}, {$set:{cart: newCart}}).then(_ => {
//       this.cart = newCart
//     })
//   }

//   getOrderById(orderId) {
//     return db.getDB().collection('orders').findOne({_id : new mongodb.ObjectId(orderId)})
//   }
//   getOrders() {
//     return db.getDB().collection('orders').find({'user.userId' : new mongodb.ObjectId(this.userId)}).toArray()
//   }
//   restCart() {
//     this.cart.products = []
//     return db.getDB().collection('users').updateOne({_id : new mongodb.ObjectId(this.userId)}, {$set:{cart: {products: []}}})
//   }
// }

/* MONGOOSE */

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

  password:{
    type:String,
    required:true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: false
  },
  resetToken: String,
  resetTokenExp: Date,
  cart: {
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
    }]
  }
})

userSchema.methods.addToCart = function(product) {
    if (!this.cart.products) {
      this.cart = {products:[]}
    }
    // chaeck if product is exsists in the cart
    const cartItemIndex = this.cart.products.findIndex(pro => {
      return pro.productId.equals(product._id)
    })
    if (cartItemIndex == -1) {
      // the product is new in the cart
      const quantity = 1;
      const newProduct = {productId: product._id, quantity:quantity}
      this.cart.products = [...this.cart.products, newProduct]
    } else {
      // update old product
      const quantity = this.cart.products[cartItemIndex].quantity + 1
      const updatedProduct = {productId: product._id, quantity:quantity}
      this.cart.products[cartItemIndex] = updatedProduct
    }
    return this.save()
}
userSchema.methods.deleteFromCart = function(deletedId) {
    const productIndex = this.cart.products.find(product => product.productId.equals(deletedId))
    if (productIndex !== -1) {
      this.cart.products = this.cart.products.filter(product => !product.productId.equals(deletedId))
    }
    return this.save()
}
userSchema.methods.resetTheCart = function() {
  this.cart.products = []
  return this.save() 
}


module.exports =  mongoose.model('User', userSchema)
