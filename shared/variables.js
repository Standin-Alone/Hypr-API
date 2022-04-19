// For general purpose
global.xss  = require('xss');
global.striptags = require('striptags');
global.validator = require('validator');
global.session = require('express-session');
global.csrf = require('csurf');
global.flash = require('connect-flash');
// global.helmet = require('helmet');
global.async = require('async');
global.passport = require('passport');
global.passportLocal = require('passport-local').Strategy;
global.GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
global.gcal = require('google-calendar');
global.mongoose = require('mongoose');
// global.cors = require('cors');
global.schema  = mongoose.Schema;
global.config = require('../config/dbconfig');
global.mongoSanitize = require('mongo-sanitize');
global.mongoStore = require('connect-mongo')(session);
global.multer = require('multer');
global.multerS3 = require('multer-s3');
global.sha1 = require('sha1');
global.otplib = require('otplib');
global.nodemailer = require('nodemailer');
global.cryptoJS = require('crypto-js');
global.ejs = require("ejs");
global.tinify = require('tinify');
global.AWS = require('aws-sdk');
global.service = 'gmail.com'
global.port = 587
global.host = 'smtp.gmail.com'
global.user = 'hyprfun@gmail.com'
global.pass = 'HyprTeam1@'
global.fromEmail = 'hyprfun@gmail.com'
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
// global.transporter = nodemailer.createTransport({
//     SES: new AWS.SES({
//         apiVersion: process.env.SES_API_VERSION,
//         region: process.env.SES_REGION
//     })
// });

global.transporter = nodemailer.createTransport({
    service: 'gmail.com',
    host: 'smtp.gmail.com',
    auth: {
        user: 'developer01000@gmail.com',
        pass: '01000webdeveloper'
    }
});

global.sns = new AWS.SNS({
    apiVersion: process.env.SNS_API_VERSION,
    region: process.env.SNS_REGION
});
global.s3 = new AWS.S3();

global.fetch = require('node-fetch');
global.pdf = require('html-pdf');
global.fs = require('fs');
global.stream = require('stream');

//Messages
global.genericErrorMessage = "Seems like something went wrong.Please try it again";
global.genericSuccessMessage = "Data saved successfully";
global.allFieldsRequired = "All fields are required";

global.aadharValidator  = require('aadhaar-validator');

global.Razorpay = require('razorpay');



// global.razorpayInstance = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET
// });
