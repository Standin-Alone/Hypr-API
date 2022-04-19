var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

require('../modal/dbContext')
const userFunctions = require('../shared/functions');
let   stripeAPI =  { STRIPE_SECRET_KEY: 'sk_test_51KnhTJGAX1ovFy7TMDtGCPVy0UOnaZWO0cdMcS5cytztE0a1sw3S2jSEytJfmWzI6SvWNROc7TGoGze41AbIgFsx00szySNDGm'};

const stripe = require('stripe')(stripeAPI.STRIPE_SECRET_KEY);



router.post('/stripeCheckout', async (req, res) => {
  let lineItemsPayload = req.body.lineItemsPayload;

  let orderId = req.body.orderId;
  try{
    const session = await stripe.checkout.sessions.create({
      line_items: lineItemsPayload,
      mode: 'payment',
      success_url: `${process.env.DEV_URL}/successPayment?sc_checkout=success&paymentId=${orderId}&payerId=${orderId}&paymentTitle=Stripe`,
      cancel_url: `${process.env.DEV_URL}/cancelledPayment?sc_checkout=cancel&paymentTitle=Stripe`,
    });
    
    
    // res.redirect(`${process.env.DEV_URL}/successPayment?checkout=success`);
    
     res.send({
        status:true,
        checkoutSessionId:session.id,        
    })
    
  }catch(error){
    console.warn('error session', error);
    res.json({
      status:false,
      msg:'Something went wrong!'
    })


  }
});





router.post('/stripePaymentSuccess', async (req, res) => {
  const payerId = req.body.payerId;
  const paymentId = req.body.paymentId;
  const cart = req.body.cart;
  const totalAmount = req.body.totalAmount;
  const _id = req.body._id;



  // payment order start here

   // var ProductDetails = await productSchema.findOne({ _id: ProductId });
   var UserDetails = await UsersSchema.findOne({ _id: _id });
   
   
   //  return
   var order_id = await counterSchema.findOneAndUpdate({ _id: "order_id" }, {
       $inc: { sequence: 1 }
   }, { useFindAndModify: false });

   
   
   
   var options = {
       f_orderDate: new Date,
       f_displayOrderId: payerId,
       f_paymentMode: 'Stripe',
       f_orderStatus: 'pending',//req.body.orderStatus,
       f_paymentmethod: 'Confirm',
       f_paymentStatus: 'Paid',
       f_buyerId: UserDetails._id,
       f_buyerEmail: UserDetails.f_email,
       f_billingName: UserDetails.f_name,
       //   f_sellerId: "",
      //  f_billingAddress: req.body.billingAddress,
      //  f_billingCity: req.body.billingCity,
      //  f_billingCountry: req.body.billingCountry,
      //  f_billingState: req.body.billingState,
      //  f_billingContactNo: req.body.billingContactNo,
      //  f_billingPinCode: req.body.billingPinCode,
       f_orderTotalAmount: totalAmount,// req.body.orderTotalAmount,
       f_description:'',
       f_currency: 'USD',
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
           cart.forEach(element => {
               
               // for(var i=0; i<cartItem.f_itemQuantity; i++){
               //     if(cartItem.f_couponUse == true){
               //         total_amount = total_amount + (cartItem.f_OfferPrice*cartItem.f_itemQuantity);
               //     }
               db.collection('t_order_details', function (err, collection) {
                   collection.insertOne(
                       {
                           f_orderId: insertRes._id,
                           f_displayOrderId: payerId,
                           f_orderDate: Date.now(),
                           f_buyerId: UserDetails._id,
                           f_payment: 'Stripe',//req.body.paymentMode,
                           f_orderStatus: 'Ready to Shipping',//req.body.orderStatus
                           f_paymentmethod: 'card',//req.body.paymentmethod,
                           f_paymentStatus: 'paid',//req.body.paymentStatus,
                           //f_serviceId: element._id,
                           f_serviceId: element.f_ProductId,
                           f_billingName: UserDetails.f_name,
                           f_billingAddress: UserDetails.f_address,
                           f_billingCity: UserDetails.f_city,
                           f_buyerEmail: UserDetails.f_email,
                           // f_billingState: UserDetails.f_stateName,
                           f_billingCountry: 'Philippines',
                           f_billingContactNo: UserDetails.f_phone,//req.body.phone,
                           // f_billingArea: UserDetails.f_area,
                           f_billingPinCode: UserDetails.f_pincode,//req.body.pincode,
                          //  f_distributer: buyerCartRecord[0].f_sellerId,
                           f_orderTotalAmount: element.f_totalAmount,
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
                           f_currency: 'USD',
                           f_shippingAddress:element.f_shippingAddress,
                           f_freightCalculation:element.f_freightCalculation,
                           // f_coupon:element.f_coupon,
                           // f_couponPrice:element.f_couponPrice,
                           // f_couponType:element.f_couponType,
                           // f_couponUse:element.f_couponUse,
                           f_discount: '0'
                       })
               })
               sequence += 1;
               // }
           });
                    
           var opts = {
               TransactionAmount: totalAmount,
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

           await stripeOrdersSchema.create(opts, async (err, insertRes) => {
               if (err) {
                   console.log("Err in creating order " + err);
                   res.json({
                       status: false,
                       code: "E111",
                       msg: "Something went wrong"
                   })
               } else if (insertRes != null && insertRes != '') {

                   setTimeout(async () => {                   

                       cart.map(async cartItems => await CartSchema.remove({ f_buyerId: UserDetails._id,f_VariantId:cartItems.f_VariantId }, (err, docs) => {
                            if (err) throw err;
                              // res.send(docs) 
                          })

                       );
                          
                       console.warn( 'payment id',payerId)
                   
                       res.json({
                           status: true,
                           code: "S405",
                           msg: "Order created successfully..",
                           
                        //    order_id: order_id.sequence,
                           orderId:payerId,

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


  

        
 
});






module.exports = router;