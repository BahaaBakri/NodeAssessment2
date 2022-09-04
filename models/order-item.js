///////////////////////////////////// SEQULIZE ///////////////////////////////////////
const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const OrderItems = sequelize.define('orderItems', {
    id: {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        autoNull: false
    },
    quantity:Sequelize.INTEGER
})

module.exports = OrderItems