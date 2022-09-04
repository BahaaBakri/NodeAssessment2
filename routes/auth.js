const path = require('path');

const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();
const isAuth = require('../middleware/is-auth')
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

// /login => GET
router.get('/login', authController.getLogin);

// /login => POST
router.post('/login',
[
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .custom((value, {req}) => {
            if (value.includes('test')) {
                throw new Error('test is NOT allowed, try again')
            }
            return true
        })
        .custom((value, {req}) => {
            return User.findOne({email:value})
            .then(user => {
                if (!user) {
                    return Promise.reject('Invalid User, try again')
                }
            })
        }),
    body('password', 'Password should be text or number and at least 8 characters')
        .isLength({min:8})
        .isAlphanumeric(),
]
, authController.postLogin);

// /signup => GET
router.get('/signup', authController.getSignup);

// /signup => POST
router.post('/signup',
[
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .custom( (value, {req}) => {
            if (value.includes('test')) {
                throw new Error('test is NOT allowed, try again')
            }
            return true;
        })
        .custom((value, {req}) => {
            return User.findOne({email:value})
            .then(user => {
                if (user) {
                    return Promise.reject('User is exsisted, try again')
                }
            })
        }),
    body('password', 'Password should be text or number and at least 8 characters')
        .isAlphanumeric().isLength({min:8}),
    body('confirmPassword')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Password and Confirmed password aren\'t matched, Try again')
            }
            return true
        }),
],
  authController.postSignup);
// router.post('/signup', authController.postSignup);

// /reset password => GET
router.get('/reset', authController.getReset);

// /reset password second step => GET
router.get('/reset2Step', authController.getReset2Step);

// /reset password third step => GET
router.get('/reset3Step', authController.getReset3Step);

// /reset password url step => GET
router.get('/resetURLStep/:token', authController.getResetURLStep);

// /reset password => POST
router.post('/reset', authController.postReset);

// /reset password second step => POST
router.post('/reset2Step', authController.postReset2Step);

// /reset password second step => POST
router.post('/reset3Step', authController.postReset3Step);

// /logout => POST
router.post('/logout',isAuth, authController.postLogout);




module.exports = router
