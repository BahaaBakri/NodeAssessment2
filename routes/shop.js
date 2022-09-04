const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();
const isAuth = require('../middleware/is-auth')

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/product/:id', shopController.getProductById);

router.get('/cart',isAuth, shopController.getCart);

router.post('/add-to-cart',isAuth, shopController.addToCart)

router.post('/delete-from-cart',isAuth, shopController.deleteFromCart)

router.get('/orders',isAuth, shopController.getTheOrders);

router.post('/place-order',isAuth, shopController.placeOrder)

module.exports = router;
