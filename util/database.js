// const mysql = require('mysql2');
// const pool = mysql.createPool({
//     host:'localhost',
//     user:'root',
//     database: 'node-complete',
//     password: 'a5b0c1d1@MYSQL'
// })

// module.exports = pool.promise();

// SEQULAIZE

// const Sequelize = require('sequelize');
// const sequelize = new Sequelize('node-complete', 'root', 'a5b0c1d1@MYSQL', {
//     dialect:'mysql',
//     host:'localhost'
// });

// module.exports = sequelize;

// MONGODB

// const mongodb = require('mongodb');
// const mongodbClient = mongodb.MongoClient

// let _db;

// mongodbClientConnection = (callBack) => {
//     mongodbClient.connect("mongodb+srv://BahaaBakri:13010111551a5b0c1d1ATLAS@cluster0.xz8ic.mongodb.net/?retryWrites=true&w=majority")
//     .then(result => {
//         _db = result.db()
//         callBack()
//     })
//     .catch(err => {
//         console.error(err)
//         throw err
//     })
// }

// getDB = () => {
//     if (_db) {
//         return _db
//     }
//     throw 'No Any DataBase Connected'
// }

// module.exports = 
// {
//     mongodbClientConnection: mongodbClientConnection,
//     getDB:getDB
// }
