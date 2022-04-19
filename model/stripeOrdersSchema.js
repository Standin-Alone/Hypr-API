/*
  Author name : ATTI
  Description : order model after business model updation
  Date : 29 april 2021
*/
const mongoose = require('mongoose');

let stripeSchema = new mongoose.Schema({
    f_orderId: String,
    f_userId: String,
    f_name: String,
    f_email: String,
    f_intent: String,
    f_state: String,
    f_cart: String,
    f_payerInfo: Array,
    f_transactions: Array,
    createdAt: Date,
    TransactionAmount : Number,
    TransactionType : String,
    Remark : String,
    type : String,
    f_postLike : Array,
    f_postComment: Array,
    f_postImages:Array,
    f_post :String,
    ByUserId : String

}, { collection: "t_stripeOrders" });

module.exports = paypalOrderSchema = mongoose.model("t_stripeOrders", stripeSchema);