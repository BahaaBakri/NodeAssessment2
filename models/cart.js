// const fs = require('fs');
// const path = require('path');

// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   'data',
//   'cart.json'
// );

// module.exports = class Cart {
//     static addToCart(productId, productPrice, cb) {
//         fs.readFile(p, (err, data) => {
//             let cart = {products:[], totalPrice:0}
//             if (!err) {
//                 // It's not the first addition
//                 cart = JSON.parse(data)
//             }
//             let updatedProduct;
//             // check if product is exsist
//             const existingProductIndex = cart.products.findIndex(el => el.id === productId)
//             const existingProduct = cart.products[existingProductIndex]
//             if (existingProduct) {
//                 // product is exist so edit the quantity for it
//                 const newQuantity = existingProduct.qty + 1;
//                 updatedProduct = {...existingProduct, qty:newQuantity}
//                 cart.products[existingProductIndex] = updatedProduct;

//             } else {
//                 // product is not exsist so add product
//                 updatedProduct = {id:productId, qty:1}
//                 cart.products = [...cart.products, updatedProduct]
//             }
//             cart.totalPrice = cart.totalPrice + +productPrice
//             fs.writeFile(p, JSON.stringify(cart), err => {
//                 if (!err) {
//                     cb(cart)
//                 }
//             });
//         })
//     }
//     static deleteFromCart(id, price, cb) {
//         fs.readFile(p, (err, data) => {
//             if (!err) {
//                 const cart = JSON.parse(data)
//                 if (cart.products.length === 1) {
//                     cart.products = []
//                     cart.totalPrice = 0
//                 } else {
//                     const deletedProduct = cart.products.find(el => el.id === id)
//                     cart.products = cart.products.filter(el => el.id !== id)
//                     cart.totalPrice = cart.totalPrice - (price * deletedProduct.qty)
//                 }

//                 fs.writeFile(p, JSON.stringify(cart), err => {
//                     if (!err) {
//                         cb('success')
//                     }
//                 })
//             }
//         })
//     }

//     static getCart(cb) {
//         fs.readFile(p, (err, data) => {
//             if (!err) {
//                 const cart = JSON.parse(data)
//                 cb(cart)
//             } else {
//                 cb(null)
//             }
            
//         })
//     }
// } 

///////////////////////////////////// SEQULIZE ///////////////////////////////////////
const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Cart = sequelize.define('carts', {
    id: {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        autoNull: false
    }
})

module.exports = Cart