const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const StoreSession = require('connect-mongodb-session')(session)
// const sequelize = require('./util/database');
// const Product = require('./models/product');
const User = require('./models/user');
const { log } = require('console');
const csurf = require('csurf');
const MONGODB_URI = "mongodb+srv://BahaaBakri:13010111551a5b0c1d1ATLAS@cluster0.xz8ic.mongodb.net/test"
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item')
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item')

// const db = require('./util/database');

// express
const app = express();

// sql database test
// database.execute("SELECT * FROM products")
// .then(result => {
//     console.log(result[0]);
// }).catch(err => {
// });

// view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// body parser
app.use(bodyParser.urlencoded({ extended: false }));

// session
const storeSession = new StoreSession({
    uri: MONGODB_URI,
    collection:'session'
})
// session
app.use(session({
    secret: 'Bahaa',
    resave: false,
    saveUninitialized: false,
    store: storeSession
}))

// csurf
app.use(csurf())

// flash
app.use(flash())

// static path
app.use(express.static(path.join(__dirname, 'public')));

// local variables for all views

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn
    res.locals.csurfTocken = req.csrfToken()
    next()
})

// middlewares
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

// Association

// One User Many Products (FK in products table)
// Product.belongsTo(User, {constraints: true, onDelete: "CASCADE"});
// User.hasMany(Product)

//  one user one cart (FK in cart table)

// Cart.belongsTo(User)
// User.hasOne(Cart)

// many carts many products (the mediator table is cartItems)

// Cart.belongsToMany(Product, {through: CartItem})
// Product.belongsToMany(Cart, {through: CartItem})

//  one user many orders (FK in order table)

// Order.belongsTo(User)
// User.hasMany(Order)

// many orders many products (the mediator table is orderItems)

// Order.belongsToMany(Product, {through: OrderItem})
// Product.belongsToMany(Order, {through: OrderItem})


// create tables => lanuch if it's at least one user

// sequelize.sync()
// .then(result => {
//     return User.findByPk(1);
// })
// .then(user => {
//     if (!user) {
//         return User.create({name: 'Bahaa', email:'bahaa.bakri1995@gmail.com'})
//     }
//     return user;
// })
// .then(user => {
//     // user exsist => create cart
//     return user.createCart()
// })
// .then(_ => {
//     app.listen(3000);
// })
// .catch(err => {
//     console.log(err);
// })

// db.mongodbClientConnection(result => {
//     console.log('CONNECTED SUCCESFULLY');
//     app.listen(3000)
// })

// MONGOOSE
mongoose.connect(MONGODB_URI)
    .then(_ => {
        console.log("CONNECTED SUCCESSFULLY");
        app.listen(3000)
    })
    .catch(err => {
        console.error(err);
    })
