// const fs = require('fs');
// const path = require('path');
// const Cart = require('./cart');
// const db = require('../util/database')

// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   'data',
//   'products.json'
// );

// const getProductsFromFile = cb => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       cb([]);
//     } else {
//       cb(JSON.parse(fileContent));
//     }
//   });
// };

// module.exports = class Product {
//   constructor(title, imageUrl, description, price) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
// this.id = Math.random()
// getProductsFromFile(products => {
//   products.push(this);
//   fs.writeFile(p, JSON.stringify(products), err => {
//     if (!err) {
//       cb('success')
//     }
//   });
// });
//   return db.execute("INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?) ",
//   [this.title, this.price, this.description, this.imageUrl]);
// }
// edit(id) {
//   const newProduct = {...this, id:id}
// Product.fetchAll(products => {
//   const editIndex = products.findIndex(product => product.id === id)
//   if (editIndex !== -1) {
//     products[editIndex] = newProduct
//     fs.writeFile(p, JSON.stringify(products), err => {
//       if (!err) {
//         cb('success')

//       }
//     });
//   }
// })
//   return db.execute("UPDATE products SET title=?, description=?, imageUrl=?, price=? WHERE id=?",
//   [newProduct.title, newProduct.description, newProduct.imageUrl, newProduct.price, id]);

// }
// static delete(id) {
// Product.fetchAll(products => {
//   const deletedProduct = products.find(el => el.id === id)
//   const newProducts = products.filter(product => product.id!== id )
//   fs.writeFile(p, JSON.stringify(newProducts), err => {
//     if (!err) {
//       // check if product in cart
//       Cart.getCart(cart => {
//         if (cart.products.find(prod => prod.id === id)) {
//           // delete from cart
//           Cart.deleteFromCart(id, deletedProduct.price, cb2 => {
//             cb('success')
//           })
//         } else {
//           cb('success')
//         }
//       })

//     }
//   });
// })
//   return db.execute("DELETE FROM products WHERE id = ?", [id])
// }

// static fetchAll() {
// getProductsFromFile(cb);
//   return db.execute("SELECT * FROM products")
// }

// static fetchProductById(id) {
// Product.fetchAll(products => {
//   cb(products.find(product => product.id === id))
// })
//     return db.execute("SELECT * FROM products WHERE id = ?", [id])
//   }
// };

///////////////////////////////////// SEQULIZE ///////////////////////////////////////
// const Sequelize = require('sequelize')
// const sequelize = require('../util/database')

// const Product = sequelize.define('products', {
//   id: {
//     type:Sequelize.INTEGER,
//     autoIncrement:true,
//     allowNull:false,
//     primaryKey:true
//   }, 
//   price: {
//     type:Sequelize.DOUBLE,
//     allowNull:false
//   },
//   title :Sequelize.STRING,
//   description: {
//     type:Sequelize.STRING,
//     allowNull:false
//   },
//   imageUrl: {
//     type:Sequelize.STRING,
//     allowNull:false
//   }
// });
// module.exports = Product;

/////////////////////////  MONOGODB  ///////////////////////////////////

// const db = require('../util/database')
// const mongodb = require('mongodb');
// const res = require('express/lib/response');

// module.exports = class Product {
//   constructor(title, imageUrl, description, price, id, userId) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId

//   }

//   save() {
//     if (this._id) {
//       return db.getDB()
//       .collection('products')
//       .updateOne({_id: this._id}, {$set:this})
//     }
//     return  db.getDB()
//     .collection('products')
//     .insertOne(this)
//     // console.log('HJJJJH');
//     // return sadas
//   }
//   static fetchAll() {
//     return db.getDB().collection('products').find().toArray()
//   }

//   static fetchById(prodId) {
//     return db.getDB().collection('products').find({_id: new mongodb.ObjectId(prodId)}).next()
//   }
//   static deleteById(prodId) {
//     return db.getDB().collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)})
//   }
// }

///////////////////////////// MONGOOSE ////////////////////////////////////////

const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type:String,
    required: true
  },
  imageUrl: {
    type:String,
    required: true
  },
  userId: {
    type:mongoose.Types.ObjectId,
    ref: 'User'
  }

})

module.exports = mongoose.model('Product', ProductSchema)
