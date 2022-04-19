global.UsersSchema = require('../model/userModel');
global.catTypeSchema = require('../model/catTypeModel').catTypeSchema;
global.categorySchema = require('../model/categorySchema');
global.productSchema = require('../model/productSchema');
global.CartSchema = require('../model/addToCartSchma');
global.orderSchema = require('../model/orderSchema');
global.orderDetailsSchema = require('../model/orderdetailSchema');
global.counterSchema = require('../model/counterSchema').counterSchema;
global.CountrySchema = require('../model/countrySchema')
global.StateSchema = require('../model/stateSchema')
global.CitySchema = require('../model/citySchema')
global.PincodeSchema = require('../model/pinCodeSchema')
global.paypalOrderSchema = require('../model/paypalOrderschema')
global.stripeOrdersSchema = require('../model/stripeOrdersSchema')
global.helpNsupportSchema = require('../model/helpsupportSchema')

//socail
global.SocialPost = require('../model/socialModel/socialPostSchema')
global.feelingsActivitiesSchema = require('../model/socialModel/feelingActivitySchema')
global.FollowSchema = require('../model/socialModel/followSchema')
global.SavePostSchema = require('../model/socialModel/SavePostSchema')

//GROUP SOCIAL
global.GroupsSchema = require('../model/socialModel/groupSchema')
global.PageSchema = require('../model/socialModel/pageSchema')
global.GroupPost = require('../model/socialModel/grouppostSchema')
global.PagePost = require('../model/socialModel/PagepostSchema')
global.SaveGroupPostSchema = require('../model/socialModel/SaveGroupPostSchema')
global.SavePagePostSchema = require("../model/socialModel/SavePagePostSchema")
global.GroupJoinedSchema = require("../model/socialModel/groupjoinSchema")
global.PageLikedSchema = require("../model/socialModel/t_PageLikedSchema")