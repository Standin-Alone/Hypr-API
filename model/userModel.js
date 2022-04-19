/*
  Author name : ATTI
  Description : user model after business model updation
  Date : 5 march 2020
*/
require('../shared/variables');

let userNewSchema = new schema({


    f_name: String,
    l_name: String,
    f_email: String,
    f_username: String,
    f_password: String,
    f_phone: Number,
    f_country: String,
    f_countryName: String,
    f_address: String,
    f_area: String,
    f_city: String,
    f_landmark: String,
    f_pincode: Number,
    f_state: String,
    f_about:String,
    otp: Number,
    RefCode: String,
    ReferCodeBy : String,
    f_picture:String,
    f_coverPic:String,
    UserReferCode: String,
    f_date: String,
    f_dob: Date,
    f_age: Number,
    accessToken:String,
    social_type: String,
    signupType: String,
    startDate: Date,
    appID: String,
    shareToken: String,
    loginAt: Date,
    lastLogin: Date,
    createdAt: Date,
    updatedAt: Date,
    status: Boolean,
    f_wallet: Number,
    verifiedDate: Date,
    f_shipping_Address:Array
    //  { collection: "t_product" });
    },{collection:"t_BuyerNode"});

module.exports = UsersSchema = mongoose.model("t_BuyerNode", userNewSchema);