const User = require('../models/user');
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const user = require('../models/user');
const { body, validationResult } = require('express-validator');
const SENDGRID_API_KEY = "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"
const SENDGRID_SENDER = "bahaa.bakri1995@gmail.com"

// config send email by create transporter using sendgrid api key
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API_KEY
    }
}))
exports.getLogin = (req, res,next) => {
    // console.log(req.get('Cookie'));
    // console.log(req.get('Cookie').search('isLoggedIn'));
    // console.log(req.get('Cookie').search(/[;\s]/));
    // let isLoggedIn
    // if (req.get('Cookie')) {
    //     const cookiesArr = req.get('Cookie').split(/[;,]/)
    //     const cookieStrIndex = cookiesArr.findIndex(el => {
    //         return (el.search('isLoggedIn') > -1)
    //     })
    //     if (cookieStrIndex > -1) {
    //         isLoggedIn = (cookiesArr[cookieStrIndex].split('=')[1].trim() === 'true') ? true : false
    //         console.log(isLoggedIn);
    //     } else {
    //         isLoggedIn = false
    //     }
    // } else {
    //     isLoggedIn = false
    // }
    const errorMessageArray = req.flash('error')
    const successMessageArray = req.flash('success')
    const errorMessage = (errorMessageArray.length > 0) ? errorMessageArray[0] : null;
    const successMessage = (successMessageArray.length > 0) ? successMessageArray[0] : null;

    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: errorMessage,
        successMessage: successMessage
    })
}

exports.postLogin = (req, res,next) => {
    // res.setHeader('Set-Cookie', 'isLoggedIn=true; Secure');

    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            path: '/login',
            errorMessage: errors.errors[0].msg,
            successMessage: null
        })
    }

    User.findOne({email:email}).then(user => {
        bcrypt.compare(password, user.password)
        .then(result => {
            if (!result) {
                req.flash('error', 'Invalid Password, Try again')
                res.redirect('/login') 
            } else {
                req.session.user = user
                req.session.isLoggedIn = true
                req.session.save(err=> { 
                    console.error(err)
                    res.redirect('/') // redirect once save the session
                })
            }
        })
        .catch(err => {
            req.flash('error', 'Something wrong, Try again')
            res.redirect('/login') 
        })
    }).catch(err => {
        req.flash('error', 'Something wrong, Try again')
        res.redirect('/login') 
    })

}

exports.getSignup = (req, res, next) => {
    const errorMessageArray = req.flash('error')
    const errorMessage = (errorMessageArray.length > 0) ? errorMessageArray[0] : null;
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        errorMessage: errorMessage
    })
}

exports.postSignup = (req, res, next) => {

    // body parser
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            pageTitle: 'Signup',
            path: '/signup',
            errorMessage: errors.errors[0].msg
        })
    }
    // encrypt password
    bcrypt.hash(password, 12)
    .then(encryptedPassword => {
        const newUser = new User({
            email:email,
            name:name,
            password:encryptedPassword,
            cart:{products:[]}
        })
        return newUser.save()
    })
    .then(_ => {
        req.flash('success', 'User is added, Login now')
        res.redirect('/login')
        return transporter.sendMail({
            to: email,
            from: SENDGRID_SENDER,
            subject: 'Welcome on board',
            html: `<h1>Hello ${name}</h1><p>Welcome to our website ...</p>`
        })
    })
    .then(_ => {
        console.log(`Email Sended to ${email}`);
    })
    .catch(err => {
        console.error(err)
    })

}

exports.getReset = (req, res, next) => {
    const errorMessageArray = req.flash('error')
    const successMessageArray = req.flash('success')
    const errorMessage = (errorMessageArray.length > 0) ? errorMessageArray[0] : null;
    const successMessage = (successMessageArray.length > 0) ? successMessageArray[0] : null;
    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: '/reset',
        errorMessage: errorMessage,
        successMessage: successMessage
    })

}
let userIdToResetPassword;
exports.postReset = (req, res, next) => {
    // create crypto
    let token;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            req.flash('error', 'Something wrong, Try again')
            return res.redirect('/reset')
        }
        token = buffer.toString('hex')
    })
    // check if the email is exsist and get the userid
    const email = req.body.email
    User.findOne({email: email}).then(user => {
        if (user) {
            userIdToResetPassword = user._id
            // set resetToken and experid date
            user.resetToken = token
            user.resetTokenExp = Date.now() + (60*60*1000) // available for 1 hour
            // create random otp as an alternative way
            codeOTPEmail = Math.floor(100000 + Math.random() * 900000);
            user.save()
            .then(user => {
                return transporter.sendMail({
                    to:user.email,
                    from:SENDGRID_SENDER,
                    subject:'Verficatuon Code',
                    html: 
                    `<h1>Hi ${user.name}</h1>
                    <div>
                        You asked to reset the password, so here the code 
                        <mark>${codeOTPEmail}</mark>
                    </div>
                    <div>
                        OR use this link 
                        <a href="http://localhost:3000/resetURLStep/${token}">Reset</a>
                    </div>`
                })
            }).then(_ => {
                // Email sended
                req.flash('success', `Type code which have sent to ${email}`)
                res.redirect('/reset2Step')
            })
            .catch(err => {
                req.flash('error', 'Something wrong, Try again')
                res.redirect('/reset')
                console.error(err)
            })
        } else {
            req.flash('error', 'This email not related to any of our users')
            res.redirect('/reset')
        }
    }).catch(err => {
        req.flash('error', 'Something wrong, Try again')
        res.redirect('/reset')
        console.error(err)
    })

}
exports.getReset2Step = (req, res, next) => {
    // check again the userid if it is correct
    User.findOne({_id: userIdToResetPassword})
    .then(user => {
        if (user) {      
                const errorMessageArray = req.flash('error')
                const successMessageArray = req.flash('success')
                const errorMessage = (errorMessageArray.length > 0) ? errorMessageArray[0] : null;
                const successMessage = (successMessageArray.length > 0) ? successMessageArray[0] : null;
                res.render('auth/reset2Step', {
                    pageTitle: 'Reset Password',
                    path: '/reset2Step',
                    errorMessage: errorMessage,
                    successMessage: successMessage
                })
        } else {
            req.flash('error', 'Something wrong, Try again')
            res.redirect('/reset')
        }
    }).catch(err => {
        req.flash('error', 'Something wrong, Try again')
        res.redirect('/reset')
    })
}

exports.postReset2Step = (req, res, next) => {
    const codeOTPForm = req.body.code;
    User.findOne({_id: userIdToResetPassword})
    .then(user => {
        if (user) {
            if (codeOTPForm !== codeOTPEmail) {
                // otp code is correct so reset the password
                req.flash('sucess', `Enter new password`)
                res.redirect('/reset3step')
            } else {
                req.flash('error', 'You entered a wrong code, Try again')
                res.redirect('/reset2Step')
            }
        } else {
            req.flash('error', 'Something wrong, Try again')
            res.redirect('/reset2Step')
        }
    })
}
exports.getReset3Step = (req, res, next) => {
    // check again the userid if it is correct
    User.findOne({_id: userIdToResetPassword})
    .then(user => {
        if (user) {
            const errorMessageArray = req.flash('error')
            const successMessageArray = req.flash('success')
            const errorMessage = (errorMessageArray.length > 0) ? errorMessageArray[0] : null;
            const successMessage = (successMessageArray.length > 0) ? successMessageArray[0] : null;
            res.render('auth/reset3Step', {
                pageTitle: 'Reset Password',
                path: '/reset3Step',
                errorMessage: errorMessage,
                successMessage: successMessage
            })
        } else {
            req.flash('error', 'Something wrong, Try again')
            res.redirect('/reset2Step')
        }
    })
}

exports.getResetURLStep = (req, res, next) => {
    const token = req.params.token
    User.findOne({resetToken:token, resetTokenExp: {$gt:Date.now()}})
        .then(user => {
            if (user) {
                const errorMessageArray = req.flash('error')
                const successMessageArray = req.flash('success')
                const errorMessage = (errorMessageArray.length > 0) ? errorMessageArray[0] : null;
                const successMessage = (successMessageArray.length > 0) ? successMessageArray[0] : null;
                res.render('auth/reset3Step', {
                    pageTitle: 'Reset Password',
                    path: '/reset3Step',
                    errorMessage: errorMessage,
                    successMessage: successMessage
                })
            } else {
                req.flash('error', 'Your access not valid, Try again')
                res.redirect('/reset')
            }
        }).catch(err => {
            req.flash('error', 'Something wrong, Try again')
            res.redirect('/reset')
            console.error(err)
        })
}

exports.postReset3Step = (req, res, next) => {
    // check again the userid if it is correct
    User.findOne({_id: userIdToResetPassword})
    .then(user => {
        if (user) {
            const newPassword = req.body.newPassword
            bcrypt.hash(newPassword, 12)
            .then(encryptedPassword => {
                user.password = encryptedPassword;
                user.resetToken = undefined;
                user.resetTokenExp = undefined;
                return user.save()
            }).then(_ => {
                req.flash('success', 'Password updated successfully, Login now')
                res.redirect('/login')
            })

        } else {
            req.flash('error', 'Something wrong, Try again')
            res.redirect('/reset3Step')
        }
    })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.error(err)
        res.redirect('/') // redirect once destroy the session
    })
}