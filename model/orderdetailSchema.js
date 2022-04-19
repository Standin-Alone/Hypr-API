/*
  Author name : ATTI
  Description : order details model after business model updation
  Date : 29 march 2020
*/
require('../shared/variables');

let orderDetailsNewSchema = new schema({
    f_orderId:   String ,
    f_displayOrderId:   String ,
    f_orderDate:   Date ,
    f_buyerId:   mongoose.Schema.Types.ObjectId ,
    f_payment:   String ,
    f_orderStatus:   String ,
    f_paymentmethod:   String ,
    f_paymentStatus:   String ,
    f_ProductId:   String ,
    f_sellerId:   String ,
    f_billingName:   String ,
    f_billingAddress:   String ,
    f_billingCity:   Number ,
    f_buyerEmail:   String ,
    f_billingCountry:   String ,
    f_billingContactNo:   String ,
    f_billingPinCode:   String ,
    f_orderTotalAmount:   String ,
    f_ProductPrice:   String ,
    f_OfferPrice:   String,
    f_ProductCode:   String ,
    f_ProductName:   String ,
    f_sellerName:   String ,
    f_ProductImg1:   String , 
    f_brandName:   String ,
    f_itemQuantity:   String ,
    f_description:   String ,
    f_currency:   String , 
    f_discount:   String ,
    f_cancelSubject : String,
    f_cancelReason : String,
    f_variantName : String,
    f_shippingAddress : Array,
    f_freightCalculation : Array,
    status:   Boolean ,
    createdAt:   Date ,
    updatedAt:   Date 
}, { collection: "t_order_details" });

module.exports = orderDetailsSchema = mongoose.model("t_order_details", orderDetailsNewSchema);

// module.exports = {
//     orderDetailsSchema: orderDetailsSchema
// };
