const mongoose = require('mongoose');

const productModel = new mongoose.Schema({

    f_productname: String,
    f_brandName: String,
    status: Number,
    f_productCode: String,
    f_sellerId: String,
    f_productdescription: String,
    f_defaultImg: String,
    f_defaultImg: String,
    f_uniqueUrl: String,
    f_videoUrl: String,
    f_sellerName: String,
    f_refundPolicy: String,
    f_recordStatus: String,
    f_product_Sellerstatus: String,
    f_Sellerstatus: String,
    f_specification: String,
    f_categoryTypeId: String,
    f_categoryTypeName: String,
    f_SellerUniqueCode: String,
    f_ImageAltText: String,
    f_img1: String,
    f_img2: String,
    f_img3: String,
    f_img4: String,
    f_img5: String,
    f_catLevel1: String,
    f_catLevel1Name: String,
    f_catLevel2: String,
    f_catLevel2Name: String,
    f_catLevel3: String,
    f_catLevel3Name: String,
    f_filterData: String,
    f_searchKeyword: String,
    f_product_offer_price: String,
    f_product_price: String,
    f_seller_amount: String,
    updatedDate: Date,
    sortNumber: Number,
    inStock: String,
    flash_sale: Boolean,
    top_pick: Boolean,
    best_selling: Boolean,
    season_top_pic: Boolean,
    trending_offer: Boolean,
    variants: Array,
    createdAt: Date,
    updatedAt: Date ,
    //  { collection: "t_product" });
    },{collection:"t_product"});

module.exports = productSchema = mongoose.model("t_product", productModel);