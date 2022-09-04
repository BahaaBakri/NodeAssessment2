const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

const isAuth = require('../middleware/is-auth')

// /admin/add-product => GET
router.get('/edit-product',isAuth, adminController.getAddEditProduct);

// /admin/edit-product => GET
router.get('/edit-product/:productId',isAuth, adminController.getAddEditProduct);

// /admin/products => GET
router.get('/products',isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',isAuth, adminController.postAddEditProduct);

// // /admin/edit-product => POST
router.post('/edit-product',isAuth, adminController.postAddEditProduct);

// // /admin/delete-product => POST
router.post('/delete-product',isAuth, adminController.postDelete);
module.exports = router;
