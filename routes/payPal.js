var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
require('../modal/dbContext')
const userFunctions = require('../shared/functions');

const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AfdCS1POr8r2-8zBgOJSF18PJc8CLLOGJq1t_HzvVStD8CvTqvM9EAFgbnLZ0KjLQ5nswsbnwlGG6-96',
    'client_secret': 'EMe8ejf_979-NeyxYHwJTsEstWz77WPFuly5npQTqGuKBwSr-RsD6SNZxpDeIL1uXmkIS-cb6bCxfha9'
});



var amt = null;
var _id = null;


router.get('/finalCheckout/:amt/:userId', (req, res) => {

    amt = req.params.amt;
    _id = req.params.userId
    console.log(req.params);
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://api.hyprweb.com/success",
            "cancel_url": "http://api.hyprweb.com/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Hyprweb APP",
                    "sku": "001",
                    "price": amt,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": amt
            },
            "description": "Hat for the best team ever"
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            res.redirect('/cancelledPayment')
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });

});

router.get('/success', async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    console.log("payerId", payerId, "paymentId", paymentId)
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": amt
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
        if (error) {
           res.redirect('/cancelledPayment')
        } else {
            var UserDetails = await UsersSchema.findOne({ _id: mongoose.Types.ObjectId(_id) });
            var opts = {
                TransactionType: "Credited",
                Remark: "Fund Added By Paypal",
                ByUserId: "Self",
                f_orderId: payerId,
                f_userId: UserDetails._id,
                f_name: UserDetails.f_name,
                f_email: UserDetails.f_email,
                f_intent: payment.intent,
                f_state: payment.state,
                f_cart: payment.cart,
                f_payerInfo: payment.payer,
                f_transactions: payment.transactions,
                createdAt: Date.now()
            }
            await paypalOrderSchema.create(opts, async (err, insertRes) => {
                // console.log(opts);
                if (err) {
                    console.log("Err in creating order " + err);
                    res.redirect('/cancelledPayment')
                } else if (insertRes != null && insertRes != '') {
                    console.log(UserDetails._id);
                    console.log(parseInt(UserDetails.f_wallet) + '----' + parseInt(amt));
                    await UsersSchema.updateOne({ _id: mongoose.Types.ObjectId(UserDetails._id) }, {
                        $set: {
                            f_wallet: parseInt(UserDetails.f_wallet) + parseInt(amt)
                        }
                    })

                    setTimeout(() => {
                        // res.json(
                        //     {
                        //         status: 'success',
                        //         data: payment
                        //     });
                        res.redirect('/successPayment?payerId=' + payerId + '&paymentId=' + paymentId)
                    }, 500);

                }
            })
        }
    });
});

// router.get('/cancel', (req, res) => res.send('Cancelled'));
router.get('/cancel', (req, res) => res.redirect('/cancelledPayment'));

router.get('/successPayment', async (req, res) => {
    console.log(req.query.q);
    res.render('successPayment', {
        payerId: req.query.payerId,
        paymentId: req.query.paymentId
    })
})

router.get('/cancelledPayment', async (req, res) => {
    console.log(req.query.q);
    res.render('cancelledPayment')
})


// router.get('/transferMoneyInWallet', async (req, res) => {
  
//    res.send(1234)
router.post('/transferMoneyInWallet', async (req, res) => {
   try {
    console.log(req.body);
    var UserInfoFrom = await UsersSchema.findOne({ f_email: req.body.emailIdFrom });
    var UserInfoTo = await UsersSchema.findOne({ f_email: req.body.emailIdTo });
    var UserInfopost = await SocialPost.findOne({ _id:mongoose.Types.ObjectId(req.body.postid)});
     console.log(UserInfopost.f_postImages);
    // console.log(UserInfoTo);
    
    
    if (UserInfoFrom != null && UserInfoTo != null) {
        var opts = {
            TransactionAmount: parseInt(req.body.transferAmount),
            TransactionType: "Credited",
            Remark: "GET TRANSFER AMOUNT",
            ByUserId: UserInfoTo._id,
            type : "1",
            f_name: UserInfoTo.f_name,
            f_email: UserInfoTo.f_email,
            f_postLike : UserInfopost.f_postLike,
             f_postComment : UserInfopost.f_postComment,
          f_postImages : UserInfopost.f_postImages,
             f_post : UserInfopost.f_post,
            // f_orderId: insertRes.f_displayOrderId + '-0' + (sequence + 1),
            f_userId: UserInfoFrom._id,
            // f_name: UserDetails..f_name,
            // f_email: UserDetails.f_wallet.f_email,
            // f_intent: response.body.intent,
            // f_state: response.body.state,
            // f_cart: response.body.cart,
            // f_payerInfo: response.body.payer,
            // f_transactions: response.body.transactions,
            createdAt: Date.now()
        }
        // console.log(opts);                  
        await paypalOrderSchema.create(opts, async (err, insertRes) => {
            if (err) {
                console.log("Err in creating order " + err);
                res.json({
                    status: false,
                    code: "E111",
                    msg: "Something went wrong"
                })
            } else if (insertRes != null && insertRes != '') {
                // console.log(parseInt(UserInfoFrom.f_wallet) + parseInt(req.body.transferAmount));
                // console.log(req.body.emailIdTo);
                await UsersSchema.updateOne({ f_email: req.body.emailIdTo }, {
                    $set: {
                        f_wallet: parseInt(UserInfoFrom.f_wallet) + parseInt(req.body.transferAmount)
                    }
                })
            }
        })




        var opts = {
            TransactionAmount: parseInt(req.body.transferAmount),
            TransactionType: "Debited",
            Remark: "Transfer Amount",
            ByUserId: UserInfoFrom._id,
            //f_orderId: insertRes.f_displayOrderId + '-0' + (sequence + 1),
            f_userId: UserInfoTo._id,
            type : "1",
            f_name: UserInfoTo.f_name,
             f_email: UserInfoTo.f_email,
             f_postLike : UserInfopost.f_postLike,
             f_postComment : UserInfopost.f_postComment,
          f_postImages : UserInfopost.f_postImages,
             f_post : UserInfopost.f_post,
            // f_postComment : UserInfopost.f_postComment,
            // f_postImages : UserInfopost.f_postImages,
            // f_post : UserInfopost.f_post,
            // f_intent: response.body.intent,
            // f_state: response.body.state,
            // f_cart: response.body.cart,
            // f_payerInfo: response.body.payer,
            // f_transactions: response.body.transactions,
            createdAt: Date.now()
        }
        // console.log(opts);                  
        await paypalOrderSchema.create(opts, async (err, insertRes) => {
            if (err) {
                console.log("Err in creating order " + err);
                res.json({
                    status: false,
                    code: "E111",
                    msg: "Something went wrong"
                })
            } else if (insertRes != null && insertRes != '') {
                console.log(parseInt(UserInfoTo.f_wallet) + parseInt(req.body.transferAmount));
                console.log(req.body.emailIdFrom);
                await UsersSchema.updateOne({ f_email: req.body.emailIdFrom }, {
                    $set: {
                        f_wallet: parseInt(UserInfoTo.f_wallet) - parseInt(req.body.transferAmount)
                    }
                })
            }
        })

        setTimeout(() => {
            res.json({
                status: true,
                data: "Transfer finished!"
            })
        }, 500);
    } else {
        res.json({
            status: false,
            data: "Email Id not exists!"
        })
    }
       
   } catch (error) {
       console.log(error)
   }
})



module.exports = router;