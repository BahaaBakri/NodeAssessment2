const { redirect } = require('express/lib/response');
// const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order')

exports.getProducts = (req, res, next) => {
  // Product.fetchAll(products => {
  //   res.render('shop/product-list', {
  //     prods: products,
  //     pageTitle: 'All Products',
  //     path: '/products'
  //   });
  // });
  // Product.fetchAll().then(([rows, fileData]) => {
  //   res.render('shop/product-list', {
  //     prods: rows,
  //     pageTitle: 'All Products',
  //     path: '/products'
  //   });
  // }).catch(err => {
  //   console.error(err);
  // })

  Product.find().exec().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      isSpecificData: null,
      path: '/products'
    });
  }).catch(err => {
    console.error(err);
  })
};
exports.getProductById = (req, res, next) => {
  const id = req.params.id;
  // Product.fetchProductById(id, product => {
  //   res.render('shop/product-detail', {
  //     product: product,
  //     pageTitle: product.title,
  //     path: '/product-details'
  //   });
  // });
  // Product.fetchProductById(id).then(([product, _]) => {
  //   res.render('shop/product-detail', {
  //     product: product[0],
  //     pageTitle: product.title,
  //     path: '/product-details'
  //   });
  // }).catch(err => {
  //   console.error(err)
  // })

  // Product.findAll({where:{id:id}}).then(product => {
  //   res.render('shop/product-detail', {
  //     product: product[0],
  //     pageTitle: product[0].title,
  //     path: '/product-details'
  //   });
  // }).catch(err => {
  //   console.error(err)
  // })

  Product.findById(id).exec().then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/product-details'
    });
  }).catch(err => {
    console.error(err)
  })
};

exports.getIndex = (req, res, next) => {
  // Product.fetchAll().then(([rows, fileData]) => {
  //   res.render('shop/product-list', {
  //     prods: rows,
  //     pageTitle: 'All Products',
  //     path: '/'
  //   });
  // }).catch(err => {
  //   console.error(err);
  // })

  console.log(req.session.isLoggedIn);
  Product.find()
  .select('title imageUrl')
  .populate('userId', 'name')
  .exec().then(products => {
    console.log(products);
    const isSpecificData = true
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      isSpecificData: isSpecificData,
      path: '/'
    });
  }).catch(err => {
    console.error(err);
  })
};

exports.getCart = (req, res, next) => {
  // const cartProducts =[];
  // req.user.getCart() // magic sequlaize function
  // .then(cart => {
  //   return cart.getProducts() // magic sequlaize function
  //   .then(products => {
  //     res.render('shop/cart', {
  //       prods: products,
  //       pageTitle: 'Cart',
  //       path: '/cart'
  //     });
  //   })

  // });

  // MONGODB
  // req.user.getCart().then(cartProducts => {
  //   res.render('shop/cart', {
  //     prods: cartProducts,
  //     pageTitle: 'Cart',
  //     path: '/cart'
  //   })
  // })

  // MONGOOSE
  User.findOne({_id: req.session.user})
  .populate('cart.products.productId')
  .then(cartProducts => {
    // console.log('/////////////////////////');
    // console.log(cartProducts.cart.products);
    res.render('shop/cart', {
      prods: cartProducts,
      pageTitle: 'Cart',
      path: '/cart'
    })
  })
};

exports.addToCart = (req, res, next) => {
  const id = req.body.id
  // let fetchedCart;
  // let newQuantity = 1;
  // Product.fetchProductById(id, (product) => {
  //   Cart.addToCart(id, product.price, cart => {
  //     console.log(cart);
  //     res.redirect('/cart')
  //   })
  // })
  // req.user.getCart()
  // .then(cart => {
  //   fetchedCart = cart
  //   cart.getProducts({where:{id:id}})
  //   .then(products => {
  //     let product;
  //     // check if product is exsist inside cart
  //     if (products.length > 0) {
  //       product = products[0]
  //     }
  //     if (product) {
  //       // product is exsist => increase the quantity
  //       newQuantity  = product.cartItems.quantity + 1;
  //       return product;
  //     }
  //     // product is NOT exsist => add it to the cart
  //     return Product.findByPk(id)
  //     .then(product => {
  //       return product
  //     })
  //     .catch(err => console.error(err))
  //   })
  //   .then(product => {
  //     return fetchedCart.addProduct(product, {through: {quantity: newQuantity}})
  //   })
  //   .then(_ => {
  //     res.redirect('/cart')
  //   })
  // })
  // .catch(err => console.error(err))

  // MONGODB
  // Product.fetchById(id).then(product => {
  //   return req.user.addToCart(product)
  // }).then (result => {
  //   res.redirect('/cart');
  // }).catch(err => {
  //   console.error(err)
  // })

  // MONGOOSE
  Product.findById(id).then(product => {
    return User.findOne({_id: req.session.user}).then(user => {
      return user.addToCart(product)
    })
  }).then (_ => {
    res.redirect('/cart');
    console.log("ADDED TO CART");
  }).catch(err => {
    console.error(err)
  })
}
exports.deleteFromCart = (req, res, next) => {
  const id = req.body.id
  User.findOne({_id: req.session.user}).then(user => {
    return user.deleteFromCart(id)
  }).then(_ => {
      res.redirect('/cart')
    }).catch(err => {
      console.log(err)
    })
  // Product.fetchProductById(id, (product) => {
  //   Cart.deleteFromCart(id, product.price, cb => {
  //     res.redirect('/cart')
  //   })
  // })
}

exports.placeOrder = (req, res, next) => {
  // let fetchedCart;
  // req.user.getCart()
  // .then(cart => {
  //   fetchedCart = cart
  //   return cart.getProducts()
  // })
  // .then(products => {
  //   // create a new order and assign all cart products to it
  //   return req.user.createOrder()
  //   .then(order => {
  //     return order.addProducts(products.map(product => {
  //       product.orderItems = {quantity: product.cartItems.quantity}
  //       return product
  //     }))
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   })
  // })
  // .then(_ => {
  //   console.log('Order is created sussusfully');
  //   // rest the cart
  //   fetchedCart.setProducts(null)
  // })
  // .then(_ => {
  //   res.redirect('/orders')
  // })
  // .catch(err => {
  //   console.log(err);
  // })

  // MONGODB
  // req.user.addOrder().then(_ => {
  //   res.redirect('/orders')
  // }).catch(err => {
  //   console.log(err);
  // })

  // MONGOOSE
  User.findOne({_id: req.session.user})
  .populate('cart.products.productId')
  .then(user => {
    const cartProducts = user.cart.products
    return Order.create({
      showenId:Math.random(),
      products:cartProducts,
      userId: req.session.user
    })
  })
  .then(_ => {
    // console.log("************************");
    // console.log("Order Placed");
    // reset the cart
    return User.findOne({_id: req.session.user}).then(user => {
      return user.resetTheCart()
    })
  })
  .then(_ => {
    // console.log("Cart is rested");
    res.redirect('/orders');
  })
  .catch(err => {
    console.log(err);
  })
}
exports.getTheOrders = (req, res, next) => {
  Order.find({userId: req.session.user})
  .populate('userId') // populate user data
  .populate('products.productId') // populate product data
  .then(orders => {
    // console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%55');
    // console.log(orders);
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
};
