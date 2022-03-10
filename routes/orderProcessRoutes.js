var express = require('express');
var router = express.Router();
require('../modal/dbContext')
const userFunctions = require('../shared/functions');
router.route("/addToShoppingCart")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    }).post(async (req, res) => {
        //var categoryType = await catTypeSchema.find();
        console.log(req.body);
        try {
            let _id = userFunctions.santizeInput(req.body.userId);
            let ProductId = userFunctions.santizeInput(req.body.ProductId);
            // let userId = userFunctions.santizeInput(req.body.userId);
            //let password = userFunctions.santizeInput(req.body.password);
            if (_id != null) {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                }, {
                    __v: 0,
                    createdAt: 0,
                    password: 0,
                    updatedAt: 0
                }, (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log("Error in user.find login " + err);
                        res.json({
                            status: false,
                            msg: userFunctions.mongooseErrorHandle(err),
                            code: "E130"
                        });
                    } else if (result == null || result == undefined || result == '') {
                        res.json({
                            status: false,
                            msg: "There is no account associated with this Userid, Pls login first!",
                            code: "E123"
                        });
                    } else {

                        CartSchema.find({ f_ProductId: ProductId, f_buyerId: _id }, async (err, result1) => {
                            // console.log(err);
                            console.log(result1.length);
                            // return
                            // res.send(result)
                            if (result1.length == 0) {
                                var ProductDetails = await productSchema.findOne({ _id: ProductId });
                                var UserDetails = await UsersSchema.findOne({ _id: _id });
                                var options = {
                                    "f_sellerId": ProductDetails.f_sellerId,
                                    "f_ProductId": ProductDetails._id,
                                    "f_ProductPrice":req.body.product_price,// ProductDetails.f_product_price,
                                    "f_OfferPrice":req.body.product_price,// ProductDetails.f_product_offer_price,
                                    "f_productCode": ProductDetails.f_productCode,
                                    "f_ServiceName": ProductDetails.f_productname,
                                    "f_sellerName": ProductDetails.f_sellerName,
                                    "f_ProductImg1": ProductDetails.f_img1,
                                    "f_categoryTypeName": ProductDetails.f_categoryTypeName,
                                    "f_categoryTypeId": ProductDetails.f_categoryTypeId,
                                    "f_categoryName": ProductDetails.f_catLevel1Name,
                                    "f_categoryId": ProductDetails.f_catLevel1,
                                    "f_itemQuantity": 1,
                                    "f_buyerId": UserDetails._id,
                                    "f_buyerName": UserDetails.f_name + ' ' + UserDetails.l_name,
                                    "f_totalAmount": parseInt(ProductDetails.f_product_offer_price),
                                    "f_variantName" : req.body.variantName,
                                    "f_createdDate": new Date,
                                    "f_coupon": "",
                                    "f_couponPrice": 0,
                                    "f_couponType": "",
                                    "f_couponUse": false,
                                    "f_discount": 0,
                                }

                                CartSchema.create(options, (err, insertRes) => {
                                    if (err) {
                                        console.log("Err in inserting add to cart " + err);
                                        res.json({
                                            status: false,
                                            code: "E111",
                                            msg: userFunctions.mongooseErrorHandle(err)
                                        })
                                    } else if (insertRes != null && insertRes != '') {
                                        //send email otp
                                        // if (result == true) {
                                        res.json({
                                            status: true,
                                            code: "S405",
                                            msg: "Item added in your cart!",
                                            id: insertRes._id,
                                        })
                                    }
                                })
                            }
                            else {
                                res.json({
                                    status: false,
                                    msg: "Item already exists in the cart!",
                                    data: []
                                });
                            }

                        })

                    }
                })

            }



        } catch (e) {
            console.log("Catch in usersignup api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }


    })

router.route("/CartQuantityIncrease")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    }).post(async (req, res) => {
        //var categoryType = await catTypeSchema.find();
        console.log(req.body);
        try {
            let _id = userFunctions.santizeInput(req.body.userId);
            let cardId = userFunctions.santizeInput(req.body.cartId);
            //  let ProductId = userFunctions.santizeInput(req.body.ProductId);
            // let userId = userFunctions.santizeInput(req.body.userId);
            //let password = userFunctions.santizeInput(req.body.password);
            if (_id != null) {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                }, {
                    __v: 0,
                    createdAt: 0,
                    password: 0,
                    updatedAt: 0
                }, async (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log("Error in user.find login " + err);
                        res.json({
                            status: false,
                            msg: userFunctions.mongooseErrorHandle(err),
                            code: "E130"
                        });
                    } else if (result == null || result == undefined || result == '') {
                        res.json({
                            status: false,
                            msg: "There is no account associated with this Userid, Pls login first!",
                            code: "E123"
                        });
                    } else {
                        var CartDetails = await CartSchema.findOne({ _id: cardId });
                        console.log(CartDetails);
                        var newQuantity = parseInt(CartDetails.f_itemQuantity) + 1;
                        var f_totalAmount = newQuantity * CartDetails.f_OfferPrice;
                        var options = {
                            f_itemQuantity: newQuantity,
                            f_totalAmount: f_totalAmount,
                            updatedAt: new Date
                        }
                        CartSchema.findByIdAndUpdate(cardId, {
                            $set: options
                        }, {
                            new: true
                        }, (err, updatedDocs) => {
                            if (err) {
                                console.log("Err in inserting add to cart " + err);
                                res.json({
                                    status: false,
                                    code: "E111",
                                    msg: userFunctions.mongooseErrorHandle(err)
                                })
                            } else {
                                //send email otp
                                // if (result == true) {
                                res.json({
                                    status: true,
                                    code: "S405",
                                    msg: "1 more Item added in your cart!",
                                    id: _id,
                                })
                            }
                        })
                    }
                })

            }



        } catch (e) {
            console.log("Catch in usersignup api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }


    })

router.route("/CartQuantityDecrease")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    }).post(async (req, res) => {
        //var categoryType = await catTypeSchema.find();
        console.log(req.body);
        try {
            let _id = userFunctions.santizeInput(req.body.userId);
            let cardId = userFunctions.santizeInput(req.body.cartId);
            //  let ProductId = userFunctions.santizeInput(req.body.ProductId);
            // let userId = userFunctions.santizeInput(req.body.userId);
            //let password = userFunctions.santizeInput(req.body.password);
            if (_id != null) {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                }, {
                    __v: 0,
                    createdAt: 0,
                    password: 0,
                    updatedAt: 0
                }, async (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log("Error in user.find login " + err);
                        res.json({
                            status: false,
                            msg: userFunctions.mongooseErrorHandle(err),
                            code: "E130"
                        });
                    } else if (result == null || result == undefined || result == '') {
                        res.json({
                            status: false,
                            msg: "There is no account associated with this Userid, Pls login first!",
                            code: "E123"
                        });
                    } else {
                        var CartDetails = await CartSchema.findOne({ _id: cardId });
                        console.log(CartDetails);
                        var newQuantity = parseInt(CartDetails.f_itemQuantity) - 1;
                        var f_totalAmount = newQuantity * CartDetails.f_OfferPrice;
                        var options = {
                            f_itemQuantity: newQuantity,
                            f_totalAmount: f_totalAmount,
                            updatedAt: new Date
                        }
                        CartSchema.findByIdAndUpdate(cardId, {
                            $set: options
                        }, {
                            new: true
                        }, (err, updatedDocs) => {
                            if (err) {
                                console.log("Err in inserting add to cart " + err);
                                res.json({
                                    status: false,
                                    code: "E111",
                                    msg: userFunctions.mongooseErrorHandle(err)
                                })
                            } else {
                                //send email otp
                                // if (result == true) {
                                res.json({
                                    status: true,
                                    code: "S405",
                                    msg: "1  Item less in your cart!",
                                    id: _id,
                                })
                            }
                        })
                    }
                })

            }


        } catch (e) {
            console.log("Catch in usersignup api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }


    })


router.route("/removeItemFromCart")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    }).post(async (req, res) => {
        //var categoryType = await catTypeSchema.find();
        console.log(req.body);
        try {
            let _id = userFunctions.santizeInput(req.body.userId);
            let cardId = userFunctions.santizeInput(req.body.cartId);
            //  let ProductId = userFunctions.santizeInput(req.body.ProductId);
            // let userId = userFunctions.santizeInput(req.body.userId);
            //let password = userFunctions.santizeInput(req.body.password);
            if (_id != null) {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                }, {
                    __v: 0,
                    createdAt: 0,
                    password: 0,
                    updatedAt: 0
                }, async (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log("Error in user.find login " + err);
                        res.json({
                            status: false,
                            msg: userFunctions.mongooseErrorHandle(err),
                            code: "E130"
                        });
                    } else if (result == null || result == undefined || result == '') {
                        res.json({
                            status: false,
                            msg: "There is no account associated with this Userid, Pls login first!",
                            code: "E123"
                        });
                    } else {
                        var CartDetails = await CartSchema.findOne({ _id: cardId });
                        console.log(CartDetails);
                        var newQuantity = parseInt(CartDetails.f_itemQuantity) - 1;
                        var f_totalAmount = newQuantity * CartDetails.f_OfferPrice;
                        var options = {
                            f_itemQuantity: newQuantity,
                            f_totalAmount: f_totalAmount,
                            updatedAt: new Date
                        }
                        CartSchema.findByIdAndRemove(cardId, (err, docs) => {
                            if (err) {
                                console.log("Err in deleting add to cart " + err);
                                res.json({
                                    status: false,
                                    code: "E111",
                                    msg: userFunctions.mongooseErrorHandle(err)
                                })
                            } else {
                                //send email otp
                                // if (result == true) {
                                res.json({
                                    status: true,
                                    code: "S405",
                                    msg: "item removed from your card!",
                                    id: docs._id,
                                })
                            }
                        })
                    }
                })

            }


        } catch (e) {
            console.log("Catch in usersignup api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }


    })

router.route("/fetchActiveItemsByUser")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    }).post(async (req, res) => {
        //var categoryType = await catTypeSchema.find();
        console.log(req.body);
        try {
            let _id = userFunctions.santizeInput(req.body.userId);

            //  let ProductId = userFunctions.santizeInput(req.body.ProductId);
            // let userId = userFunctions.santizeInput(req.body.userId);
            //let password = userFunctions.santizeInput(req.body.password);
            if (_id != null) {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                }, {
                    __v: 0,
                    createdAt: 0,
                    password: 0,
                    updatedAt: 0
                }, async (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log("Error in user.find login " + err);
                        res.json({
                            status: false,
                            msg: userFunctions.mongooseErrorHandle(err),
                            code: "E130"
                        });
                    } else if (result == null || result == undefined || result == '') {
                        res.json({
                            status: false,
                            msg: "There is no account associated with this Userid, Pls login first!",
                            code: "E123"
                        });
                    } else {

                        CartSchema.find({
                            f_buyerId: _id
                        }, async (err, result1) => {
                            if (err) {
                                console.log("Err in deleting add to cart " + err);
                                res.json({
                                    status: false,
                                    code: "E111",
                                    msg: userFunctions.mongooseErrorHandle(err)
                                })
                            } else {
                                //send email otp
                                // if (result == true) {
                                res.json({
                                    status: true,
                                    code: "S405",
                                    msg: "user's cart item fetched!",
                                    id: result1,
                                })
                            }
                        })
                    }
                })

            }


        } catch (e) {
            console.log("Catch in usersignup api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }


    })



router.route("/addToWishlist")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    }).post(async (req, res) => {
        //var categoryType = await catTypeSchema.find();
        console.log(req.body);
        try {
            let _id = userFunctions.santizeInput(req.body.userId);
            let ProductId = userFunctions.santizeInput(req.body.ProductId);
            // let userId = userFunctions.santizeInput(req.body.userId);
            //let password = userFunctions.santizeInput(req.body.password);
            if (_id != null) {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                }, {
                    __v: 0,
                    createdAt: 0,
                    password: 0,
                    updatedAt: 0
                }, async (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log("Error in user.find login " + err);
                        res.json({
                            status: false,
                            msg: userFunctions.mongooseErrorHandle(err),
                            code: "E130"
                        });
                    } else if (result == null || result == undefined || result == '') {
                        res.json({
                            status: false,
                            msg: "There is no account associated with this Userid, Pls login first!",
                            code: "E123"
                        });
                    } else {

                        var buyerID = ""
                        var buyerdetails = req.user
                        if (buyerdetails != undefined) {
                            buyerID = buyerdetails._id
                        }
                        else {
                            buyerID = req.sessionID;
                        }

                        var ProdLenght = await db.collection('t_WishlistSummary').find({ f_ProductId: mongoose.Types.ObjectId(req.body.Prod_id), f_buyerId: _id }).count();
                        console.log(ProdLenght)
                        var ProdDetails = await db.collection('t_product').findOne({ _id: mongoose.Types.ObjectId(req.body.Prod_id) });
                        if (ProdLenght == 0) {
                            db.collection('t_WishlistSummary', function (err, collection) {
                                collection.insertOne(
                                    {
                                        f_ProductId: ProdDetails._id,
                                        f_ProductPrice: parseInt(ProdDetails.f_product_price),
                                        f_OfferPrice: parseInt(ProdDetails.f_product_offer_price),
                                        f_ServiceCode: ProdDetails.f_productCode,
                                        f_ServiceName: ProdDetails.f_productname,
                                        f_sellerName: ProdDetails.f_sellerName,
                                        f_ProductImg1: ProdDetails.f_img1,
                                        f_distributer: ProdDetails.f_distributer,
                                        f_serviceTypeName: ProdDetails.f_serviceTypeName,
                                        f_itemQuantity: 1,
                                        f_gstPrice: parseInt(ProdDetails.f_product_offer_price * 18) / 100,
                                        f_buyerId: req.body.userId,
                                        f_totalAmount: parseInt(ProdDetails.f_product_offer_price) + parseInt(ProdDetails.f_product_offer_price * 18) / 100,
                                        f_createdDate: Date.now(),
                                        f_coupon: "",
                                        f_couponPrice: 0,
                                        f_couponType: "",
                                        f_couponUse: false,
                                        f_discount: 0
                                    })
                            })
                            res.json({
                                status: true,
                                msg: "Item added in your wishlist!",
                            })
                        }
                        else {
                            res.json({
                                status: false,
                                msg: "Item already exists in your wishlist!",
                            })
                        }

                    }
                })

            }



        } catch (e) {
            console.log("Catch in usersignup api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }


    })


router.route("/fetchActiveWishlistByUser")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    }).post(async (req, res) => {
        //var categoryType = await catTypeSchema.find();
        console.log(req.body);
        try {
            let _id = userFunctions.santizeInput(req.body.userId);

            //  let ProductId = userFunctions.santizeInput(req.body.ProductId);
            // let userId = userFunctions.santizeInput(req.body.userId);
            //let password = userFunctions.santizeInput(req.body.password);
            if (_id != null) {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                }, {
                    __v: 0,
                    createdAt: 0,
                    password: 0,
                    updatedAt: 0
                }, async (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log("Error in user.find login " + err);
                        res.json({
                            status: false,
                            msg: userFunctions.mongooseErrorHandle(err),
                            code: "E130"
                        });
                    } else if (result == null || result == undefined || result == '') {
                        res.json({
                            status: false,
                            msg: "There is no account associated with this Userid, Pls login first!",
                            code: "E123"
                        });
                    } else {
                        await db.collection('t_WishlistSummary').find({ f_buyerId: _id }).toArray(function (err, result1) {
                            if (err) {
                                console.log("Err in deleting add to cart " + err);
                                res.json({
                                    status: false,
                                    code: "E111",
                                    msg: userFunctions.mongooseErrorHandle(err)
                                })
                            } else {
                                //send email otp
                                // if (result == true) {
                                res.json({
                                    status: true,
                                    code: "S405",
                                    msg: "user's wishlist item fetched!",
                                    id: result1,
                                })
                            }
                        })
                    }
                })

            }


        } catch (e) {
            console.log("Catch in usersignup api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }


    })


router.route("/removeWishlist")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    }).post(async (req, res) => {
        //var categoryType = await catTypeSchema.find();
        console.log(req.body);
        try {
            let _id = userFunctions.santizeInput(req.body.userId);
            let wishlistId = userFunctions.santizeInput(req.body.wishlistId);
            //  let ProductId = userFunctions.santizeInput(req.body.ProductId);
            // let userId = userFunctions.santizeInput(req.body.userId);
            //let password = userFunctions.santizeInput(req.body.password);
            if (_id != null) {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                }, {
                    __v: 0,
                    createdAt: 0,
                    password: 0,
                    updatedAt: 0
                }, async (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log("Error in user.find login " + err);
                        res.json({
                            status: false,
                            msg: userFunctions.mongooseErrorHandle(err),
                            code: "E130"
                        });
                    } else if (result == null || result == undefined || result == '') {
                        res.json({
                            status: false,
                            msg: "There is no account associated with this Userid, Pls login first!",
                            code: "E123"
                        });
                    } else {

                        await db.collection('t_WishlistSummary').remove({ _id: mongoose.Types.ObjectId(wishlistId) }, (err, docs) => {
                            //   CartSchema.findByIdAndRemove(cardId, (err, docs) => {
                            if (err) {
                                console.log("Err in deleting add to cart " + err);
                                res.json({
                                    status: false,
                                    code: "E111",
                                    msg: userFunctions.mongooseErrorHandle(err)
                                })
                            } else {
                                //send email otp
                                // if (result == true) {
                                res.json({
                                    status: true,
                                    code: "S405",
                                    msg: "item removed from your wishlist!",
                                    id: docs._id,
                                })
                            }
                        })
                    }
                })

            }


        } catch (e) {
            console.log("Catch in usersignup api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }


    })


router.route("/checkoutConfirmation")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    }).post(async (req, res) => {
        //var categoryType = await catTypeSchema.find();
        console.log(req.body);
        try {
            let _id = userFunctions.santizeInput(req.body.userId);
            //  let ProductId = userFunctions.santizeInput(req.body.ProductId);
            // let userId = userFunctions.santizeInput(req.body.userId);
            //let password = userFunctions.santizeInput(req.body.password);
            if (_id != null) {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                }, {
                    __v: 0,
                    createdAt: 0,
                    password: 0,
                    updatedAt: 0
                }, async (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log("Error in user.find login " + err);
                        res.json({
                            status: false,
                            msg: userFunctions.mongooseErrorHandle(err),
                            code: "E130"
                        });
                    } else if (result == null || result == undefined || result == '') {
                        res.json({
                            status: false,
                            msg: "There is no account associated with this Userid, Pls login first!",
                            code: "E123"
                        });
                    } else {
                        // var ProductDetails = await productSchema.findOne({ _id: ProductId });
                        var UserDetails = await UsersSchema.findOne({ _id: _id });
                        var buyerCartRecord = await CartSchema.find({ f_buyerId: _id })
                        var total_amount = 0;
                        buyerCartRecord.forEach(item => {
                            total_amount += parseInt(item.f_totalAmount);
                        });
                        console.log(buyerCartRecord);
                        //  return
                        var order_id = await counterSchema.findOneAndUpdate({ _id: "order_id" }, {
                            $inc: { sequence: 1 }
                        }, { useFindAndModify: false });
                        console.log(order_id);
                        var options = {
                            f_orderDate: new Date,
                            f_displayOrderId: order_id.sequence,
                            f_paymentMode: req.body.paymentMode,
                            f_orderStatus: 'pending',//req.body.orderStatus,
                            f_paymentmethod: req.body.paymentmethod,
                            f_paymentStatus: req.body.paymentStatus,
                            f_buyerId: UserDetails._id,
                            f_buyerEmail: UserDetails.f_email,
                            f_billingName: UserDetails.f_name,
                            //   f_sellerId: "",
                            f_billingAddress: req.body.billingAddress,
                            f_billingCity: req.body.billingCity,
                            f_billingCountry: req.body.billingCountry,
                            f_billingState: req.body.billingState,
                            f_billingContactNo: req.body.billingContactNo,
                            f_billingPinCode: req.body.billingPinCode,
                            f_orderTotalAmount: total_amount,// req.body.orderTotalAmount,
                            f_description: req.body.description,
                            f_currency: req.body.currencyFormat,
                            status: true,
                            createdAt: new Date,
                        }

                        orderSchema.create(options, async (err, insertRes) => {
                            if (err) {
                                console.log("Err in creating order " + err);
                                res.json({
                                    status: false,
                                    code: "E111",
                                    msg: userFunctions.mongooseErrorHandle(err)
                                })
                            } else if (insertRes != null && insertRes != '') {
                                //send email otp
                                // if (result == true) {

                                var total_amount = 0;
                                var sequence = 0;
                                buyerCartRecord.forEach(element => {
                                    console.log(element.f_ServiceName);
                                    // for(var i=0; i<cartItem.f_itemQuantity; i++){
                                    //     if(cartItem.f_couponUse == true){
                                    //         total_amount = total_amount + (cartItem.f_OfferPrice*cartItem.f_itemQuantity);
                                    //     }
                                    db.collection('t_order_details', function (err, collection) {
                                        collection.insertOne(
                                            {
                                                f_orderId: insertRes._id,
                                                f_displayOrderId: insertRes.f_displayOrderId + '-0' + (sequence + 1),
                                                f_orderDate: Date.now(),
                                                f_buyerId: UserDetails._id,
                                                f_payment: 'paypal',//req.body.paymentMode,
                                                f_orderStatus: 'Ready to Shipping',//req.body.orderStatus
                                                f_paymentmethod: 'wallet',//req.body.paymentmethod,
                                                f_paymentStatus: 'paid',//req.body.paymentStatus,
                                                //f_serviceId: element._id,
                                                f_serviceId: element.f_ProductId,
                                                f_billingName: UserDetails.f_name,
                                                f_billingAddress: UserDetails.f_address,
                                                f_billingCity: UserDetails.f_city,
                                                f_buyerEmail: UserDetails.f_email,
                                                // f_billingState: UserDetails.f_stateName,
                                                f_billingCountry: 'India',
                                                f_billingContactNo: UserDetails.f_phone,//req.body.phone,
                                                // f_billingArea: UserDetails.f_area,
                                                f_billingPinCode: UserDetails.f_pincode,//req.body.pincode,
                                                f_distributer: buyerCartRecord[0].f_sellerId,
                                                f_orderTotalAmount: element.f_OfferPrice,
                                                f_ProductPrice: element.f_ProductPrice,
                                                f_OfferPrice: element.f_OfferPrice,
                                                f_ServiceCode: element.f_ServiceCode,
                                                f_ServiceName: element.f_ServiceName,
                                                f_sellerName: element.f_sellerName,
                                                f_ProductImg1: element.f_ProductImg1,
                                                f_serviceTypeName: element.f_serviceTypeName,
                                                f_itemQuantity: element.f_itemQuantity,
                                                f_variantName : element.f_variantName,
                                                f_description: req.body.f_description,
                                                f_currency: 'INR',
                                                // f_coupon:element.f_coupon,
                                                // f_couponPrice:element.f_couponPrice,
                                                // f_couponType:element.f_couponType,
                                                // f_couponUse:element.f_couponUse,
                                                f_discount: element.f_discount
                                            })
                                    })
                                    sequence += 1;
                                    // }
                                });
                                db.collection('t_mailtemplet').find({ f_sno: '4411' }).toArray(function (EmailErr, Emailresult) {
                                    if (EmailErr) throw EmailErr;

                                    var transporter = nodemailer.createTransport({
                                        service: 'gmail.com',
                                        host: 'smtp.gmail.com',
                                        auth: {
                                            user: 'alamarbaj1920@gmail.com',
                                            pass: 'arbajalam7379012070'
                                        }
                                    });
                                    // const email_payment_logo = await db.collection('t_seller_images').find({ f_type: "EL", f_show_image: true, f_published: true }).sort({ f_sort_no: 1 }).limit(1).toArray();
                                    // const email_social_media = await db.collection('t_seller_images').find({ f_type: "SME", f_show_image: true, f_published: true }).sort({ f_sort_no: 1 }).toArray();
                                    // var i;
                                    let text = ``;
                                    // for (i = 0; i < email_social_media.length; i++) {
                                    //     text += `<a href="${email_social_media[i].f_url}"><img alt="${email_social_media[i].f_alt_text}" src="http://eskillsellerdocs.cstechns.com/SellerDocuments/sellerDocsImg/${email_social_media[i].f_image_name}"/></a>`
                                    // }
                                    var mailOptions = {
                                        from: 'alamarbaj1920@gmail.com',//mailfrom,
                                        to: UserDetails.f_email,//'ati@cstech.in',
                                        cc: 'atti7466@gmail.com',
                                        subject: 'Your order successfully Placed | Hypr',
                                        html: Emailresult[0].f_mailmessage
                                            .replace('{vendorurl}', '<a href="http://beta.hyprweb.com">Click Here</a>')
                                            .replace('{orderdate}', new Date().toISOString().slice(0, 10))
                                            .replace('{orderstatus}', 'Pending')
                                            .replace('{user-name}', UserDetails.f_name)
                                            .replace('{email-logo}', `<a href="http://beta.hyprweb.com/"><img height="80%" width="80%" src="http://beta.hyprweb.com/images/logos/Hypr-Logo.png"/></a>`)
                                            .replace("{socialmedia}",)
                                            .replace('Itsherskill', 'hypr')
                                            .replace('Itsherway', 'hypr')
                                            .replace('http://beta.hyprweb.com', '#')
                                            .replace('http://beta.itsherskill.com/content/SellerPolicy', '#')
                                            .replace('http://beta.itsherskill.com/customer-contactus', '#')
                                            .replace('{copy-right}', '© 2021-2022 hypr.All rights reserved')
                                            .replace('{mpname}', 'hypr')
                                            .replace('{mpname}', 'hypr')
                                            .replace('{mpname}', 'hypr')
                                        // .replace('{email-payment-logo}', `<a href=" "><img src="http://eskillsellerdocs.cstechns.com/SellerDocuments/sellerDocsImg/${email_payment_logo[0].f_image_name}" width="560" alt=""></a>`)
                                    };
                                    transporter.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            console.log('Email sent: ' + info.response);
                                        }
                                    });
                                })
                                var opts = {
                                    TransactionAmount: total_amount,
                                    TransactionType: "Debited",
                                    Remark: "Product  Purchase",
                                    ByUserId: "Admin",
                                    f_orderId: insertRes.f_displayOrderId + '-0' + (sequence + 1),
                                    f_userId: UserDetails._id,
                                    // f_name: UserDetails..f_name,
                                    // f_email: UserDetails.f_wallet.f_email,
                                    // f_intent: response.body.intent,
                                    // f_state: response.body.state,
                                    // f_cart: response.body.cart,
                                    // f_payerInfo: response.body.payer,
                                    // f_transactions: response.body.transactions,
                                    createdAt: Date.now()
                                }
                                console.log(opts);

                                await paypalOrderSchema.create(opts, async (err, insertRes) => {
                                    if (err) {
                                        console.log("Err in creating order " + err);
                                        res.json({
                                            status: false,
                                            code: "E111",
                                            msg: "Something went wrong"
                                        })
                                    } else if (insertRes != null && insertRes != '') {

                                        setTimeout(async () => {
                                            var remaingMoney = parseInt(UserDetails.f_wallet - total_amount)
                                            console.log(remaingMoney);
                                            console.log(UserDetails.f_wallet + '--' + remaingMoney + '--' + total_amount);
                                            await UsersSchema.updateOne({ _id: mongoose.Types.ObjectId(UserDetails._id) }, {
                                                $set: {
                                                    f_wallet: remaingMoney// parseInt(req.user.f_wallet) - parseInt(totalAmnt)
                                                }
                                            })
                                            await CartSchema.remove({ f_buyerId: UserDetails._id }, (err, docs) => {
                                                if (err) throw err;
                                                // res.send(docs)

                                            })
                                            res.json({
                                                status: true,
                                                code: "S405",
                                                msg: "Order created successfully..",
                                                order_id: order_id.sequence
                                            })
                                        }, 1000);
                                    }
                                })
                                // res.json({
                                //     status: true,
                                //     code: "S405",
                                //     msg: "Order created successfully..",
                                //     order_id: order_id.sequence
                                // })
                            }
                        })

                    }
                })
            }

        } catch (e) {
            console.log("Catch in usersignup api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }


    })


router.route("/OrderSummary")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    }).post(async (req, res) => {
        //var categoryType = await catTypeSchema.find();
        console.log(req.body);
        try {
            let _id = userFunctions.santizeInput(req.body.userId);
            // let f_buyerId = userFunctions.santizeInput(req.body.f_buyerId);
            // let userId = userFunctions.santizeInput(req.body.userId);
            //let password = userFunctions.santizeInput(req.body.password);
            if (_id != null) {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                }, {
                    __v: 0,
                    createdAt: 0,
                    password: 0,
                    updatedAt: 0
                }, async (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log("Error in user.find login " + err);
                        res.json({
                            status: false,
                            msg: userFunctions.mongooseErrorHandle(err),
                            code: "E130"
                        });
                    } else if (result == null || result == undefined || result == '') {
                        res.json({
                            status: false,
                            msg: "There is no account associated with this Userid, Pls login first!",
                            code: "E123"
                        });
                    } else {
                        // console.log(req.body._Id);
                        var Order = await orderDetailsSchema.find({ "f_buyerId": mongoose.Types.ObjectId(_id) });
                        console.log(Order)
                        if (Order != null) {
                            res.json({
                                status: true,
                                msg: "Order Fatch Succefully!",
                                data: Order
                            })
                        }
                        else {
                            res.json({
                                status: false,
                                msg: "Order not Found!",
                                data: Order
                            })
                        }

                    }
                })

            }



        } catch (e) {
            console.log("Catch in usersignup api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }


    })






router.route("/OrderDetail")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    }).post(async (req, res) => {
        //var categoryType = await catTypeSchema.find();
        console.log(req.body);
        try {
            let _id = userFunctions.santizeInput(req.body.userId);
            // let f_buyerId = userFunctions.santizeInput(req.body.f_buyerId);
            // let userId = userFunctions.santizeInput(req.body.userId);
            //let password = userFunctions.santizeInput(req.body.password);
            if (_id != null) {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                }, {
                    __v: 0,
                    createdAt: 0,
                    password: 0,
                    updatedAt: 0
                }, async (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log("Error in user.find login " + err);
                        res.json({
                            status: false,
                            msg: userFunctions.mongooseErrorHandle(err),
                            code: "E130"
                        });
                    } else if (result == null || result == undefined || result == '') {
                        res.json({
                            status: false,
                            msg: "There is no account associated with this Userid, Pls login first!",
                            code: "E123"
                        });
                    } else {
                        // console.log(req.body._Id);
                        var Order = await orderDetailsSchema.findOne({ "f_buyerId": mongoose.Types.ObjectId(_id) });
                        console.log(Order)
                        if (Order != null) {
                            res.json({
                                status: true,
                                msg: "Order Fatch Succefully!",
                                data: Order
                            })
                        }
                        else {
                            res.json({
                                status: false,
                                msg: "Order not Found!",
                                data: Order
                            })
                        }

                    }
                })

            }



        } catch (e) {
            console.log("Catch in usersignup api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }


    })



router.route("/AddMoneyToWallet")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    }).post(async (req, res) => {
        //var categoryType = await catTypeSchema.find();
        console.log(req.body);
        try {
            let _id = userFunctions.santizeInput(req.body.userId);
            // let f_buyerId = userFunctions.santizeInput(req.body.f_buyerId);
            // let userId = userFunctions.santizeInput(req.body.userId);
            //let password = userFunctions.santizeInput(req.body.password);
            if (_id != null) {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                }, {
                    __v: 0,
                    createdAt: 0,
                    password: 0,
                    updatedAt: 0
                }, async (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log("Error in user.find login " + err);
                        res.json({
                            status: false,
                            msg: userFunctions.mongooseErrorHandle(err),
                            code: "E130"
                        });
                    } else if (result == null || result == undefined || result == '') {
                        res.json({
                            status: false,
                            msg: "There is no account associated with this Userid, Pls login first!",
                            code: "E123"
                        });
                    } else {
                        var opts = {
                            f_orderId: req.body.paymentID,
                            f_userId: req.body.userId,
                            f_name: req.body.fullName,
                            f_email: req.body.Email,
                            f_intent: req.body.intent,
                            f_state: req.body.state,
                            f_cart: req.body.cart,
                            f_payerInfo: req.body.payer,
                            f_transactions: req.body.transactions,
                            createdAt: Date.now()
                        }
                        var totalAmnt = req.body.totalAmnt
                        await paypalOrderSchema.create(opts, async (err, insertRes) => {
                            console.log(opts);
                            if (err) {
                                console.log("Err in creating order " + err);
                                res.json({
                                    status: false,
                                    code: "E111",
                                    msg: "Something went wrong"
                                })
                            } else if (insertRes != null && insertRes != '') {
                                await UsersSchema.updateOne({ _id: mongoose.Types.ObjectId(_id) }, {
                                    $set: {
                                        f_wallet: parseInt(result[0].f_wallet) + parseInt(totalAmnt)
                                    }
                                })
                                res.json(
                                    {
                                        status: 'success',
                                        data: opts,
                                        msg: "Money added successfully.."
                                    });

                            }
                        })

                    }
                })

            }



        } catch (e) {
            console.log("Catch in usersignup api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }


    })


router.route("/WalletHistory")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    }).post(async (req, res) => {
        //var categoryType = await catTypeSchema.find();
        console.log(req.body);
        try {
            let _id = userFunctions.santizeInput(req.body.userId);
            // let f_buyerId = userFunctions.santizeInput(req.body.f_buyerId);
            // let userId = userFunctions.santizeInput(req.body.userId);
            //let password = userFunctions.santizeInput(req.body.password);
            if (_id != null) {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                }, {
                    __v: 0,
                    createdAt: 0,
                    password: 0,
                    updatedAt: 0
                }, async (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log("Error in user.find login " + err);
                        res.json({
                            status: false,
                            msg: userFunctions.mongooseErrorHandle(err),
                            code: "E130"
                        });
                    } else if (result == null || result == undefined || result == '') {
                        res.json({
                            status: false,
                            msg: "There is no account associated with this Userid, Pls login first!",
                            code: "E123"
                        });
                    } else {
                        // console.log(req.body._Id);
                        var WalletHis = await paypalOrderSchema.find({ f_userId: _id }).sort({ _id: -1 });;
                        console.log(WalletHis)
                        if (WalletHis != null) {
                            res.json({
                                status: true,
                                msg: "WalletHistory Fatch Succefully!",
                                data: WalletHis
                            })
                        }
                        else {
                            res.json({
                                status: false,
                                msg: "WalletHis not Found!",
                                data: WalletHis
                            })
                        }

                    }
                })

            }



        } catch (e) {
            console.log("Catch in usersignup api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }


    })


router.route("/sellerReviewPost")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    }).post(async (req, res) => {
        //var categoryType = await catTypeSchema.find();
        console.log(req.body);
        try {
            let _id = userFunctions.santizeInput(req.body.userId);
            // let f_buyerId = userFunctions.santizeInput(req.body.f_buyerId);
            // let userId = userFunctions.santizeInput(req.body.userId);
            //let password = userFunctions.santizeInput(req.body.password);
            if (_id != null) {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                }, {
                    __v: 0,
                    createdAt: 0,
                    password: 0,
                    updatedAt: 0
                }, async (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log("Error in user.find login " + err);
                        res.json({
                            status: false,
                            msg: userFunctions.mongooseErrorHandle(err),
                            code: "E130"
                        });
                    } else if (result == null || result == undefined || result == '') {
                        res.json({
                            status: false,
                            msg: "There is no account associated with this Userid, Pls login first!",
                            code: "E123"
                        });
                    } else {
                        // console.log(req.body._Id);
                        // var WalletHis = await paypalOrderSchema.find({ f_userId: _id }).sort({_id:-1});;
                        // console.log(WalletHis)
                        const buyerRecord = await db.collection('t_product').findOne({ _id: mongoose.Types.ObjectId(req.body.prodId) });
                        // console.log(buyerRecord._id)
                        db.collection('t_service_rating', function (err, collection) {
                            collection.insertOne(
                                {
                                    f_type: 'SellerReviews',
                                    // f_userid: '5d9312a00bc5001ea411a445',
                                    f_description: req.body.description,
                                    f_buyerId: _id,
                                    f_buyerName: result[0].f_name,
                                    f_buyerEmail: result[0].f_email,
                                    f_ratingValue: parseInt(req.body.ratingValue),
                                    productId: buyerRecord._id,
                                    f_productCode: buyerRecord.f_productCode,
                                    f_img1: result[0].f_picture,
                                    f_productname: buyerRecord.f_productname,
                                    f_sellerName: buyerRecord.f_sellerName,
                                    sellerId: buyerRecord.f_distributer,
                                    createDate: Date.now(),
                                    f_status: false,
                                })
                        })
                        var ProdRecord = await db.collection('t_service_rating').aggregate([{ $match: { productId: mongoose.Types.ObjectId(buyerRecord._id) } }, { $group: { _id: null, totalRow: { $sum: 1 }, sum: { $sum: "$f_ratingValue" } } }]).toArray();
                        var RatingSum = ProdRecord[0].sum;
                        var totalRow = ProdRecord[0].totalRow;
                        var RatingAvg = RatingSum / totalRow
                        console.log(RatingAvg)
                        //    console.log(RatingSum + '--' + totalRow + '----' + RatingAvg)
                        //   console.log(RatingAvg.toFixed() + '--' + parseInt(RatingAvg.toFixed()))
                        await db.collection('t_product').updateOne({ _id: mongoose.Types.ObjectId(buyerRecord._id) }, {
                            $set: {
                                productRating: parseInt(RatingAvg.toFixed())
                            }
                        })
                        // if (WalletHis != null) {
                        res.json({
                            status: true,
                            msg: "Review submitted Succefully!",
                        })
                        // }
                        // else {
                        //     res.json({
                        //         status: false,
                        //         msg: "WalletHis not Found!",
                        //         data: WalletHis
                        //     })
                        // }

                    }
                })

            }



        } catch (e) {
            console.log("Catch in usersignup api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }


    })




router.route("/fetchReviewsByProductID")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    }).post(async (req, res) => {
        //var categoryType = await catTypeSchema.find();
        console.log(req.body);
        try {
            let _id = userFunctions.santizeInput(req.body.userId);
            // let f_buyerId = userFunctions.santizeInput(req.body.f_buyerId);
            // let userId = userFunctions.santizeInput(req.body.userId);
            //let password = userFunctions.santizeInput(req.body.password);
            if (_id != null) {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                }, {
                    __v: 0,
                    createdAt: 0,
                    password: 0,
                    updatedAt: 0
                }, async (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log("Error in user.find login " + err);
                        res.json({
                            status: false,
                            msg: userFunctions.mongooseErrorHandle(err),
                            code: "E130"
                        });
                    } else if (result == null || result == undefined || result == '') {
                        res.json({
                            status: false,
                            msg: "There is no account associated with this Userid, Pls login first!",
                            code: "E123"
                        });
                    } else {
                        // console.log(req.body._Id);
                        const ServiceReview = await db.collection('t_service_rating').find({ productId: mongoose.Types.ObjectId(req.body.productId) }).sort({ _id: -1 }).limit(10).toArray();
                        // res.send(ServiceReview) 
                        console.log(ServiceReview)
                        if (ServiceReview.length > 0) {
                            res.json({
                                status: true,
                                msg: "ServiceReview Fatch Succefully!",
                                data: ServiceReview
                            })
                        }
                        else {
                            res.json({
                                status: false,
                                msg: "ServiceReview not Found!",
                                data: ServiceReview
                            })
                        }

                    }
                })

            }



        } catch (e) {
            console.log("Catch in usersignup api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }


    })




router.route("/cancelOrderByUser")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    }).post(async (req, res) => {
        //var categoryType = await catTypeSchema.find();
        console.log(req.body);
        try {
            let _id = userFunctions.santizeInput(req.body.userId);
            // let f_buyerId = userFunctions.santizeInput(req.body.f_buyerId);
            // let userId = userFunctions.santizeInput(req.body.userId);
            //let password = userFunctions.santizeInput(req.body.password);
            if (_id != null) {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                }, {
                    __v: 0,
                    createdAt: 0,
                    password: 0,
                    updatedAt: 0
                }, async (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log("Error in user.find login " + err);
                        res.json({
                            status: false,
                            msg: userFunctions.mongooseErrorHandle(err),
                            code: "E130"
                        });
                    } else if (result == null || result == undefined || result == '') {
                        res.json({
                            status: false,
                            msg: "There is no account associated with this Userid, Pls login first!",
                            code: "E123"
                        });
                    } else {

                        await orderDetailsSchema.updateOne({ _id: mongoose.Types.ObjectId(req.body.orderId) }, {
                            $set: {
                                f_cancelSubject: req.body.cancelSubject,
                                f_cancelReason: req.body.cancelReason,
                                f_orderStatus: "Cancelled"
                            }
                        });
                        // if (ServiceReview.length > 0) {
                        res.json({
                            status: true,
                            msg: "Your Order Cancelled Succefully!",
                        })
                        // }
                        // else {
                        //     res.json({
                        //         status: false,
                        //         msg: "ServiceReview not Found!",
                        //         data: ServiceReview
                        //     })
                        // }

                    }
                })

            }



        } catch (e) {
            console.log("Catch in usersignup api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }


    })


router.route("/addNewAddress")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    }).post(async (req, res) => {
        //var categoryType = await catTypeSchema.find();
        console.log(req.body);
        try {
            let _id = userFunctions.santizeInput(req.body.userId);
            // let f_buyerId = userFunctions.santizeInput(req.body.f_buyerId);
            // let userId = userFunctions.santizeInput(req.body.userId);
            //let password = userFunctions.santizeInput(req.body.password);
            if (_id != null) {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                }, {
                    __v: 0,
                    createdAt: 0,
                    password: 0,
                    updatedAt: 0
                }, async (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log("Error in user.find login " + err);
                        res.json({
                            status: false,
                            msg: userFunctions.mongooseErrorHandle(err),
                            code: "E130"
                        });
                    } else if (result == null || result == undefined || result == '') {
                        res.json({
                            status: false,
                            msg: "There is no account associated with this Userid, Pls login first!",
                            code: "E123"
                        });
                    } else {

                        await UsersSchema.updateOne({ _id: mongoose.Types.ObjectId(_id) }, {
                            $push: {
                                f_shipping_Address: [{
                                    id: mongoose.Types.ObjectId(),
                                    name: req.body.name,
                                    mobile: req.body.mobile,
                                    pincode: req.body.pincode,
                                    location: req.body.location,
                                    address: req.body.address,
                                    city: req.body.city,
                                    state: req.body.state,
                                    landmark: req.body.landmark,
                                    AlternativePhone: req.body.AlternativePhone
                                }]
                            }

                        })
                        // if (ServiceReview.length > 0) {
                        res.json({
                            status: true,
                            msg: "Your New Address Added Succefully!",
                        })
                        // }
                        // else {
                        //     res.json({
                        //         status: false,
                        //         msg: "ServiceReview not Found!",
                        //         data: ServiceReview
                        //     })
                        // }

                    }
                })

            }



        } catch (e) {
            console.log("Catch in usersignup api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }


    })



module.exports = router;
