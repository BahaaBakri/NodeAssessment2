const Product = require('../models/product');
const user = require('../models/user');
// const Cart = require('../models/cart')

exports.getAddEditProduct = (req, res, next) => {
  const isEditMode = +req.query.edit
  const pageTitle = (isEditMode) ? 'Edit Product': 'Add Product'
  const path = (isEditMode) ? '/admin/edit-product': '/admin/add-product'
  let data;
  if (isEditMode) {
    // Edit Mode
    const id = req.params.productId;
    // Product.fetchProductById(id, editProd => {
    //   data = editProd
    //   res.render('admin/edit-product', {
    //     pageTitle: pageTitle,
    //     path: path,
    //     isEditMode: isEditMode,
    //     data:data
    //   });
    // })

    // req.user
    // .getProducts({where:{id:id}}) // magic sequlaize function
    // .then((products) => {
    //   const product = products[0]
    //   data = product
    //   res.render('admin/edit-product', {
    //     pageTitle: pageTitle,
    //     path: path,
    //     isEditMode: isEditMode,
    //     data:data
    //   })
    // }).catch(err => {
    //   console.error(err)
    // })

    // MONOGODB
    Product.findById(id).exec()
      .then((product) => {
        data = product
        res.render('admin/edit-product', {
          pageTitle: pageTitle,
          path: path,
          isEditMode: isEditMode,
          data:data
        })
    }).catch(err => {
      console.error(err)
    })
  } else {
    const emptyProd = {
      title:'',
      description:'',
      imageUrl:"",
      price: ''
    }
    data = {...emptyProd, _id:-1}
    res.render('admin/edit-product', {
      pageTitle: pageTitle,
      path: path,
      isEditMode: isEditMode,
      data:data
    });
  }

};

exports.postAddEditProduct = (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // const product = new Product(title, imageUrl, description, price);
  if (id == -1) {
    // add
    // product.save().then(_ => {
    //   console.log("Add Done");
    //   res.redirect('/');
    // }).catch(err=> {
    //   console.error(err);
    // })

    // SEQULIZE //

    // req.user
    // .createProduct({ // magic sequlaize function
    //   title:title,
    //   price:price,
    //   description:description,
    //   imageUrl:imageUrl
    // })
    // .then(_ => {
    //   console.log("Add Done");
    //   res.redirect('/');
    // }).catch(err=> {
    //   console.error(err);
    // })


    // MONOGODB
    // const product = new Product(title, imageUrl,description, price, null, req.user._id)
    // product.save()
    // .then(result => {
    //   console.log(result);
    //   res.redirect('/');
    // })
    // .catch(err => {
    //   console.log(err)
    // })

    // MONGOOSE
    Product.create({
      title:title,
      price:price,
      description:description,
      imageUrl:imageUrl,
      userId: req.session.user // automaticlly will get just the id as a referance
    })
    .then(_ => {
      console.log("Add Done");
      res.redirect('/');
    }).catch(err=> {
      console.error(err);
    })

  } else {
    // edit
    // product.edit(id).then(_ => {
    //   console.log("Edit Done");
    //   res.redirect('/');
    // }).catch(err => {
    //   console.error(err)
    // })
    // req.user.getProducts({where:{id:id}}) // magic sequlaize function
    // .then(products => {
    //   let product = products[0]
    //   product.title = title;
    //   product.description = description;
    //   product.imageUrl = imageUrl;
    //   product.price = price;
    //   return product.save()
    // }).then(_ => {
    //   console.log("Edit Done");
    //   res.redirect('/');
    // }).catch(err => {
    //   console.error(err)
    // })

    // MONOGODB
    // const product = new Product(title, imageUrl,description, price, id)
    // product.save()
    // .then(result => {
    //   console.log(result);
    //   res.redirect('/');
    // })
    // .catch(err => {
    //   console.log(err)
    // })

    // MONGOOSE First Way
    // Product.findOne(id)
    // .then(product => {
    //   product.title = title;
    //   product.description = description;
    //   product.price = price;
    //   product.imageUrl = imageUrl
    //   return product.save()
    // }).then(_ => {
    //   console.log("Edit Done");
    //   res.redirect('/');
    // }).catch(err => {
    //   console.log(err)
    // })

    // MONGOOSE Second Way
    Product.findOne({userId: req.session.user},{_id:id} ) // find user who owns this product
    .then(user => {
      if (!user) {
        return res.redirect('/')
      }
      Product.findByIdAndUpdate(id, {
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl
      }).exec().then(_=> {
        console.log("Edit Done");
        res.redirect('/');
      }).catch(err => {
        console.log(err)
        res.redirect('/')
      })
    }).catch(err => {
      console.log(err)
      res.redirect('/')
    })
  }
};
exports.postDelete = (req, res, next) => {
  const id = req.body.id
  // Product.delete(id).then(_ => {
  //   // check if product in cart
  //   Cart.getCart(cart => {
  //     if (cart.products.find(prod => prod.id === id)) {
  //       // delete from cart
  //       Cart.deleteFromCart(id, deletedProduct.price, cb2 => {
  //         console.log("Delete Done");
  //         res.redirect('/');
  //       })
  //     } else {
  //       console.log("Delete Done");
  //       res.redirect('/');
  //     }
  //   })

  // }).catch(err => {
  //   console.error(err)
  // })

  // req.user.getProducts({where:{id:id}}) // magic sequlaize function
  // .then(product => {
  //   return product.destroy()
  // }).then(_ => {
  //  // check if product in cart
  //  return prom = new Promise((resolve, reject) => {
  //     Cart.getCart(cart => {
  //       if (cart.products.find(prod => prod.id === id)) {
  //         // delete from cart
  //         Cart.deleteFromCart(id, deletedProduct.price, cb2 => {
  //           resolve()
  //         })
  //       } else {
  //         resolve()
  //       }
  //     })
  //   })
  // }).then(_ => {
  //     console.log("DELETE DONE")
  //     res.redirect('/');
  // }).catch(err => {
  //     console.error(err)
  // })

  ////// MONGODB //////
  // Product.deleteById(id)
  // .then(_ => {
  //       // check if element is exsists in the cart
  //       req.user.getCart(cart => {
  //         const productInCart = cart.products.find(cartProduct => cartProduct.productId.equal(new mongodb.ObjectId(id)))
  //         if (productInCart) {
  //           res.user.deleteFromCart(productInCart.productId)
  //         }
  //       })
  //     res.redirect('/');
  // }).catch(err => {
  //     console.error(err)
  // })

  // MONGOOSE

  Product.findOne({userId: req.session.user}) // find user who owns this product
  .then(user => {
    if (!user) {
      return res.redirect('/')
    }
    Product.findByIdAndRemove(id).exec()
    .then(_ => {
      console.log('DELETE DONE');
      res.redirect('/');
    }).catch(err => {
      console.error(err)
      res.redirect('/')
    })
  }).catch(err => {
    console.error(err)
    res.redirect('/')
  })
};

// exports.getProducts = (req, res, next) => {
//   // Product.fetchAll(products => {
//   //   res.render('admin/products', {
//   //     prods: products,
//   //     pageTitle: 'Admin Products',
//   //     path: '/admin/products'
//   //   });
//   // });
//   // Product.fetchAll().then(([products, _]) => {
//   //   res.render('admin/products', {
//   //     prods: products,
//   //     pageTitle: 'Admin Products',
//   //     path: '/admin/products'
//   //   });
//   // })

//   req.user.getProducts() // magic sequlaize function
//   .then(products => {
//     res.render('admin/products', {
//       prods: products,
//       pageTitle: 'Admin Products',
//       path: '/admin/products'
//     });
//   })
// };


exports.getProducts = (req, res, next) => {
  Product.find({userId: req.session.user}).then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'All Products',
      path: '/admin/products'
    });
  }).catch(err => {
    console.error(err);
  })
}

