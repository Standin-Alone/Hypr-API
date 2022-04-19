//==============================USER ONBOARDING==============================
/*
    Author       : ATTI
    Description  : User sign up step 1
    Created      : 05 March 2021
*/

var express = require('express');
var router = express.Router();
const userFunctions = require('../shared/functions');
// const userFunctions = require('../shared/schema');

// var uploadTalent = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: process.env.AWS_BUCKET_NAME,
//         acl: 'public-read',
//         serverSideEncryption: 'AES256',
//         contentType: function (req, file, cb) {
//             cb(null, file.mimetype);
//         },
//         metadata: function (req, file, cb) {
//             cb(null, {
//                 fieldName: file.fieldname
//             });
//         },
//         key: function (req, file, cb) {
//             var ext = file.originalname.split('.').pop();
//             let tempFileName = sha1(file.originalname + Date.now());
//             if (file.fieldname == "document") {
//                 let newFileName = file.fieldname + '-' + tempFileName + '.' + ext;
//                 cb(null, process.env.AWS_BUCKET_PROJECT_NAME + '/' + process.env.AWS_BUCKET_DOCUMENTS + '/' + newFileName);
//             } else if (file.fieldname == "f_picture") {
//                 let newFileName = file.fieldname + '-' + tempFileName + '.' + ext;
//                 cb(null, process.env.AWS_BUCKET_PROJECT_NAME + '/' + process.env.AWS_BUCKET_f_pictureS + '/' + newFileName);
//             }
//         }
//     }),

//     limits: {
//         fileSize: 3 * 1000 * 1000
//     },

//     fileFilter: function (req, file, cb) {
//         var type = file.mimetype;
//         if (file.fieldname == "f_picture") {
//             if (type !== 'image/png' && type !== 'image/jpg' && type !== 'image/jpeg') {
//                 cb(new Error('ExtensionError'));
//             } else {
//                 cb(null, true);
//             }
//         } else if (file.fieldname == "document") {
//             if (type !== 'image/png' && type !== 'image/jpg' && type !== 'image/jpeg' && type !== "application/pdf") {
//                 cb(new Error('ExtensionError'));
//             } else {
//                 cb(null, true);
//             }
//         }
//     }
// }).fields([
//     {
//         name: 'document',
//         maxcount: 1
//     },
//     {
//         name: 'f_picture',
//         maxcount: 1
//     }
// ])


router.route("/signup")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    })

    .post((req, res, next) => {
        try {
            console.log('body',req.body);
            // return

            let fname = userFunctions.santizeInput(req.body.firstName),
                lname = userFunctions.santizeInput(req.body.lastName),
                email = userFunctions.santizeInput(req.body.email),
                phone = userFunctions.santizeInput(req.body.mobileNo),
                uname = userFunctions.santizeInput(req.body.username),
                country = userFunctions.santizeInput(req.body.countryCode),
                dob = userFunctions.santizeInput(req.body.dob),
                signupType = userFunctions.santizeInput(req.body.signupType),
                social_type = userFunctions.santizeInput(req.body.social_type),
                //signupType >> 1 = buyer, 0 = seller
                // dob = userFunctions.toDate(userFunctions.santizeInput(req.body.dob)),
                age = userFunctions.santizeInput(req.body.age),
                profilePhoto = req.body.profilePhoto,
                countryCode = userFunctions.santizeInput(req.body.countryCode),
                countryName = userFunctions.santizeInput(req.body.countryName),
                password = userFunctions.santizeInput(req.body.password),
                confirmPassword = userFunctions.santizeInput(req.body.confirmPassword),
                ReferCodeBy = userFunctions.santizeInput(req.body.refCode),
                // profilePhoto = req.files.profilePhoto,
                // document = req.files.document,
                // alternatePhone = userFunctions.santizeInput(req.body.alternatePhone),
                // alternateEmail = userFunctions.santizeInput(req.body.alternateEmail),
                // representedBy = Number(userFunctions.santizeInput(req.body.representedBy)),
                // representedId = userFunctions.santizeInput(req.body.representedId),
                // peopleId = userFunctions.santizeInput(req.body.peopleId),
                msg = "",
                errorArray = [];
            
            // if (fname != null && fname != '' && lname != null && lname != '' && email != null && email != '' && phone != null && phone != ''
            //     && uname != null && uname != '' && country != null && country != '' && dob != null && dob != ''
            //     && age != null && age != '' && password != null && password != '' && confirmPassword != null
            //     && confirmPassword != '') {

            if (!validator.isEmail(email)) {
                msg = "Invalid email, please try again";
                errorArray.push(msg);
            }


            if (!validator.isMobilePhone(phone)) {
                msg = "Invalid phone number, please try again";
                errorArray.push(msg);
            }

            if (!userFunctions.checkPasswordFormat(password)) {
                msg = "Password must contain atleast 6 characters. 1 upper-case. 1 lower-case. 1 number. and 1 special character";
                errorArray.push(msg);
            }
            if (!validator.equals(password, confirmPassword)) {
                msg = "Password and confirm password didnt match"
                errorArray.push(msg);
            }
            if (age < 13) {
                msg = "user's age should be grater than 13 years.;";
                errorArray.push(msg);
            }
            
            if (errorArray.length == 0) {
                //check if the email already exists, if yes then this user was invited
                // userFunctions.checkEmailInvitationExists(email, (result, agencyId) => {
                //  if (result == true) {
                //update the existing data with the email
                //save the data to db
                let key = Date.now() + email;
                let accessToken = sha1(key);
                //var ReferCodeBy = req.body.refCode
                // console.log(ReferCodeBy)
                let generateOtp = Math.floor(Math.random() * 99999) + 10000;
                var Refcode = 'HYPR' + Math.floor(Math.random() * 899999 + 1000000);
                let options = {
                    f_name: fname,
                    l_name: lname,
                    f_email: email,
                    f_phone: phone,
                    f_picture: "",
                    f_coverPic: "",
                    f_dob: dob,
                    f_age: age,
                    f_username: uname,
                    signupType: signupType,
                    f_country: countryCode,
                    f_countryName: countryName,
                    social_type: social_type,
                    f_password: password,
                    accessToken: accessToken,
                    otp: generateOtp,
                    ReferCodeBy: req.body.refCode,
                    RefCode: Refcode,
                    status: true,
                    f_wallet: 5,
                    loginAt: Date.now(),
                    lastLogin: Date.now(),
                    createdAt: Date.now()
                }
           
                if (req.body.social_type == 'google') {
                    UsersSchema.create(options, (err, insertRes) => {
                        if (err) {
                            console.log("Err in inserting talent " + err);
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
                                msg: "Successfully sent email OTP, data saved",
                                id: insertRes._id,
                                otp: 123456,
                                accessToken: accessToken

                            })
                            // } else {
                            //     res.json({
                            //         status: false,
                            //         code: "E110",
                            //         msg: 'Could not send email OTP, data saved'
                            //     })
                            // }
                            //  SEND VERIFY ACCOUNT EMAIL

                        
                            let verification_link = `${process.env.DEV_URL}/user/verifyAccount/${result[0]._id}`;

                            
                            
                            // SEND TO EMAIL
                            ejs.renderFile('./views/templates/accountVerificationEmail.ejs',{name:`${fname} ${l_name}`,toemail:email,url:verification_link},function(err,data){                                                   
                                // co
                                // ready for email otp
                                var mailOptions = {
                                    from: "Hypr", // sender address
                                    to: email,                                        
                                    subject: 'Hypr Verification  Email',
                                    html:      data,
                                    attachments: [{
                                        filename: 'otp.jpeg',
                                        path: `${process.env.DEV_URL}/images/otp.jpeg`,
                                        cid: 'otp' //same cid value as in the html img src
                                    },{
                                        filename: 'hypr-logo.png',
                                        path: `${process.env.DEV_URL}/images/hypr-logo.png`,
                                        cid: 'logo' //same cid value as in the html img src
                                    }]
                                }
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log('Error: ' + error);
                                        console.log('Error in forgot pass email sending' + error);
                                        res.json({
                                            status: false,
                                            msg: 'Email not sent',
                                            code: 'E110'
                                        });
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                        // res.json({
                                        //     status: true,
                                        //     msg: 'Email sent successfuly',
                                        //     code: 'S405'
                                        // });

                                        res.json({
                                            status: true,
                                            code: "S405",
                                            msg: "Successfully Registered. Please check your email first to verify your account.",
                                            
                                            
                                        });
                                        


            
                                    }
                                });
                             });

                         
                            
                        } else {
                            res.json({
                                status: false,
                                code: "E111",
                                msg: "Could not create talent, try again."
                            })
                        }
                    })
                }
                else if (social_type == 'facebook') {
                    UsersSchema.create(options, (err, insertRes) => {
                        if (err) {
                            console.log("Err in inserting talent " + err);
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
                                msg: "Successfully sent email OTP, data saved",
                                id: insertRes._id,
                                otp: 123456,
                                accessToken: accessToken

                            })
                            // } else {
                            //     res.json({
                            //         status: false,
                            //         code: "E110",
                            //         msg: 'Could not send email OTP, data saved'
                            //     })
                            // }
                            return
                            userFunctions.sendMailOtpToVerifyTalentEmailId(insertRes._id, (result) => {
                                if (result == true) {
                                    res.json({
                                        status: true,
                                        code: "S405",
                                        msg: "Successfully sent email OTP, data saved",
                                        id: insertRes._id
                                    })
                                } else {
                                    res.json({
                                        status: false,
                                        code: "E110",
                                        msg: 'Could not send email OTP, data saved'
                                    })
                                }
                            })
                        } else {
                            res.json({
                                status: false,
                                code: "E111",
                                msg: "Could not create talent, try again."
                            })
                        }
                    })
                } else {
                        
                    UsersSchema.findOne({ RefCode: req.body.refCode }, async (err1, isRefCode) => {
                        
                        if (isRefCode != null) {
                            UsersSchema.findOne({ f_email: email }, async (err1, res1) => {
                                
                                if (res1 == null) {
                                    UsersSchema.create(options, (err, insertRes) => {
                                        if (err) {
                                            console.log("Err in inserting talent " + err);
                                            res.json({
                                                status: false,
                                                code: "E111",
                                                msg: userFunctions.mongooseErrorHandle(err)
                                            })
                                        } else if (insertRes != null && insertRes != '') {
                                            //send email otp
                                            // if (result == true) {
                                            


                                            let verification_link = `${process.env.DEV_URL}/user/verifyAccount/${insertRes._id}`;

                                            
                            
                                            // SEND TO EMAIL
                                            ejs.renderFile('./views/templates/accountVerificationEmail.ejs',{name:`${fname} ${lname}`,toemail:email,url:verification_link},function(err,data){                                                   
                                                // co
                                                // ready for email otp
                                                var mailOptions = {
                                                    from: "Hypr", // sender address
                                                    to: email,                                        
                                                    subject: 'Hypr Verification  Email',
                                                    html:      data,
                                                    attachments: [{
                                                        filename: 'otp.jpeg',
                                                        path: `${process.env.DEV_URL}/images/otp.jpeg`,
                                                        cid: 'otp' //same cid value as in the html img src
                                                    },{
                                                        filename: 'hypr-logo.png',
                                                        path: `${process.env.DEV_URL}/images/hypr-logo.png`,
                                                        cid: 'logo' //same cid value as in the html img src
                                                    }]
                                                }
                                                transporter.sendMail(mailOptions, function (error, info) {
                                                    if (error) {
                                                        console.log('Error: ' + error);
                                                        console.log('Error in forgot pass email sending' + error);
                                                        res.json({
                                                            status: false,
                                                            msg: 'Email not sent',
                                                            code: 'E110'
                                                        });
                                                    } else {
                                                        console.log('Email sent: ' + info.response);
                                                        // res.json({
                                                        //     status: true,
                                                        //     msg: 'Email sent successfuly',
                                                        //     code: 'S405'
                                                        // });
                
                                                        res.json({
                                                            status: true,
                                                            code: "S405",
                                                            data:insertRes,
                                                            msg: "Successfully Registered. Please check your email first to verify your account.",
                                                            
                                                            
                                                        });
                                                        
                
                
                            
                                                    }
                                                });
                                             });



                                            // } else {
                                            //     res.json({
                                            //         status: false,
                                            //         code: "E110",
                                            //         msg: 'Could not send email OTP, data saved'
                                            //     })
                                            // }
                                            return
                                            userFunctions.sendMailOtpToVerifyTalentEmailId(insertRes._id, (result) => {
                                                if (result == true) {
                                                    res.json({
                                                        status: true,
                                                        code: "S405",
                                                        msg: "Successfully sent email OTP, data saved",
                                                        id: insertRes._id
                                                    })
                                                } else {
                                                    res.json({
                                                        status: false,
                                                        code: "E110",
                                                        msg: 'Could not send email OTP, data saved'
                                                    })
                                                }
                                            })
                                        } else {
                                            res.json({
                                                status: false,
                                                code: "E111",
                                                msg: "Could not create talent, try again."
                                            })
                                        }
                                    })
                                } else {
                                    res.json({
                                        status: false,
                                        code: "E111",
                                        msg: "Email or Username already exists"
                                    })
                                }

                            })
                        } else {
                            res.json({
                                status: false,
                                code: "E111",
                                msg: "Invalid Refferal Code!"
                            })
                        }
                    })
                }
                // }
                // })
            } else {
                res.json({
                    status: false,
                    code: "E130",
                    msg: errorArray
                })
            }

            // } else {
            //     res.json({
            //         status: false,
            //         code: "E101",
            //         msg: "Please fill mandatory field(s)"
            //     })
            // }


        } catch (e) {
            console.log("Catch in usersignup api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }
    })

// VERIFY ACCOUNT HYPR
router.route("/verifyAccount/:user_id")
    .get((req, res, next) => {

    let user_id = req.params.user_id;
    
    UsersSchema.find({
            _id: mongoose.Types.ObjectId(user_id),
        }, {
            __v: 0,
            createdAt: 0,
            updatedAt: 0
        }, (err, result) => {
            // CHECK IF VERIFIED ACCOUNT
            console.warn(result[0].verifiedDate)
            if(!result[0].verifiedDate ){
                UsersSchema.findByIdAndUpdate(user_id, {
                    $set: { verifiedDate:  Date.now() }
                }, {
                    fields: {
                        password: 0,
                        otp: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        emailVerifiedFlag: 0,
                        phoneVerifiedFlag: 0,
                        __v: 0
                    },
                    new: true
                }, (err, updatedDocs) => {
                    if (err) {
                        console.log("Error in user.findByIdAndUpdate login " + err);
                        res.json({
                            status: false,
                            msg: userFunctions.mongooseErrorHandle(err),
                            code: "E130"
                        });
                    } else {

                        res.render('./templates/verified.ejs');
                        
                    }
                })

            }else{
                
                // res.json({
                //     status: true,
                //     msg: 'You are already Verified.',
                //     data: ''
                // });

                res.render('./templates/alreadyVerified.ejs');
            }

        });


      
        
    })
    

router.route("/verifyMobileOtp")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    })

    .post((req, res, next) => {
        try {
            console.log(req.body);
            let _id = userFunctions.santizeInput(req.body._id);
            let otp = userFunctions.santizeInput(req.body.otp);
            if (_id != null && otp != null) {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                }, {
                    __v: 0,
                    createdAt: 0,
                    updatedAt: 0
                }, (err, result) => {
                    console.log(result);
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
                            msg: "There is no account associated with this E-mail",
                            code: "E123"
                        });
                    } else {
                        //check for password
                        //     console.log(result[0].otp.mobileOtp);
                        if (result[0].otp == otp) {
                            //generate new access token
                            let key = Date.now() + result[0].email;

                            let options = {
                                // accessToken: accessToken,
                                otp: {
                                    mobileOtp: result[0].otp.mobileOtp,
                                    mobileVerified: 1
                                }
                            };

                            UsersSchema.findByIdAndUpdate(result[0]._id, {
                                $set: { otp: otp }
                            }, {
                                fields: {
                                    password: 0,
                                    otp: 0,
                                    createdAt: 0,
                                    updatedAt: 0,
                                    emailVerifiedFlag: 0,
                                    phoneVerifiedFlag: 0,
                                    __v: 0
                                },
                                new: true
                            }, (err, updatedDocs) => {
                                if (err) {
                                    console.log("Error in user.findByIdAndUpdate login " + err);
                                    res.json({
                                        status: false,
                                        msg: userFunctions.mongooseErrorHandle(err),
                                        code: "E130"
                                    });
                                } else {
                                    res.json({
                                        status: true,
                                        msg: 'Otp matched sucessfully..',
                                        data: ''
                                    });

                                    
                                }
                            })
                        } else {
                            res.json({
                                status: false,
                                msg: "Otp not matched !",
                                code: "E123"
                            });
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


    
router.route("/resendMobileOtp")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    })

    .post((req, res, next) => {
        try {

            let _id = userFunctions.santizeInput(req.body._id);
            let otp = userFunctions.santizeInput(req.body.otp);
            let generateOtp = req.body.otp;
            
            if (_id != null && otp != null) {
                

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                }, {
                    __v: 0,
                    createdAt: 0,
                    updatedAt: 0
                }, (err, result) => {
                    
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
                            msg: "There is no account associated with this E-mail",
                            code: "E123"
                        });
                    } else {
                        
                        var payload = {otp:generateOtp};
                        UsersSchema.findByIdAndUpdate(result[0]._id, {$set:payload}
                            ,(err,updatedDocs)=>{
                            
                            if (err) {
                                console.log("Error in user.findByIdAndUpdate login " + err);
                                res.json({
                                    status: false,
                                    msg: userFunctions.mongooseErrorHandle(err),
                                    code: "E130"
                                });
                            } else {
                                let email  = result[0].f_email;
                                ejs.renderFile('./views/templates/otpEmail.ejs',{name:`${result[0].f_name} ${result[0].l_name}`,toemail:email,otp:generateOtp},function(err,data){
                                    console.warn(err);
                           
                                 // co
                                 // ready for email otp
                                 var mailOptions = {
                                     from: "Hypr", // sender address
                                     to: email,                                        
                                     subject: 'Hypr One Time Password',
                                     html:      data,
                                     attachments: [{
                                        filename: 'otp.jpeg',
                                        path: `${process.env.DEV_URL}/images/otp.jpeg`,
                                        cid: 'otp' //same cid value as in the html img src
                                    },{
                                        filename: 'hypr-logo.png',
                                        path: `${process.env.DEV_URL}/images/hypr-logo.png`,
                                        cid: 'logo' //same cid value as in the html img src
                                    }]
                                 }
                                 transporter.sendMail(mailOptions, function (error, info) {
                                     if (error) {
                                         console.log('Error: ' + error);
                                         console.log('Error in forgot pass email sending' + error);
                                         res.json({
                                             status: false,
                                             msg: 'Email not sent',
                                             code: 'E110'
                                         });
                                     } else {
                                         console.log('Email sent: ' + info.response);
                                         res.json({
                                             status: true,
                                             msg: 'Email sent successfuly',
                                             code: 'S405'
                                         });
                                     }
                                 });
                                });

                                res.json({
                                    status: true,
                                    msg: 'Successfully resend new OTP',
                                    data: ''
                                });
                            }

                        });


                    
                    }
                })

            }



        } catch (e) {
            console.log("Catch in user resend otp api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }
    })

router.route("/signin")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    })

    .post((req, res, next) => {
        try {

            let email = userFunctions.santizeInput(req.body.email);
            let password = userFunctions.santizeInput(req.body.password);
            let appID = userFunctions.santizeInput(req.body.appID);
            let provider = userFunctions.santizeInput(req.body.f_provider);
            let generateOtp = Math.floor(Math.random() * 99999) + 10000;
            // if (appID !== undefined && provider != undefined) {
            //     UsersSchema.find({
            //         f_email: email,
            //         status: 1
            //     }, {
            //         __v: 0,
            //         createdAt: 0,
            //         otp: 0,
            //         updatedAt: 0
            //     }, (err, result) => {

            //     })
            // }
            if (email != null && email != '' && password != null && password != '') {
                //fetch the username and password from db and check if they match
                let hashedPassword = sha1(password);
                UsersSchema.find({
                    f_email: email

                }, {
                    __v: 0,
                    createdAt: 0,
                    otp: 0,
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
                            msg: "There is no account associated with this E-mail",
                            code: "E123"
                        });
                    } else {

                        //check for verification
                        if(result[0].verifiedDate == undefined){
                            
                            let verification_link = `${process.env.DEV_URL}/user/verifyAccount/${result[0]._id}`;

                            
                            console.warn(verification_link);
                            // SEND TO EMAIL
                            ejs.renderFile('./views/templates/accountVerificationEmail.ejs',{name:`${result[0].f_name} ${result[0].l_name}`,toemail:email,url:verification_link},function(err,data){                                                   
                                // co
                                // ready for email otp
                                var mailOptions = {
                                    from: "Hypr", // sender address
                                    to: email,                                        
                                    subject: 'Hypr Verification  Email',
                                    html:      data,
                                    attachments: [{
                                        filename: 'verification.jpg',
                                        path: `${process.env.DEV_URL}/images/verification.jpg`,
                                        cid: 'verification' //same cid value as in the html img src
                                    },{
                                        filename: 'hypr-logo.png',
                                        path: `${process.env.DEV_URL}/images/hypr-logo.png`,
                                        cid: 'logo' //same cid value as in the html img src
                                    }]
                                }
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log('Error: ' + error);
                                        console.log('Error in forgot pass email sending' + error);
                                        res.json({
                                            status: false,
                                            msg: 'Email not sent',
                                            code: 'E110'
                                        });
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                    

                                        res.json({
                                            status: false,
                                            msg: "You are not yet verified. Please check your email.",
                                            data:result,
                                            code: "E123"
                                        });
            
                                    }
                                });
                             });

                             
                         
                        }else{            

                                //check for password
                                if (result[0].f_password == password)  {
                                    //generate new access token
                                    let key = Date.now() + result[0].email;
                                    let accessToken = sha1(key);
                                    
                                    let options = {
                                        otp:generateOtp,                                
                                        loginAt: Date.now()
                                    };
                                
                                    
                                    UsersSchema.findByIdAndUpdate(result[0]._id, {
                                        $set: options
                                    }, {
                                        fields: {
                                            f_password: 0,
                                            otp: 0,
                                            createdAt: 0,
                                            updatedAt: 0,
                                            emailVerifiedFlag: 0,
                                            phoneVerifiedFlag: 0,
                                            __v: 0
                                        },
                                        new: true
                                    }, (err, updatedDocs) => {
                                                if (err) {
                                                    console.log("Error in user.findByIdAndUpdate login " + err);
                                                    res.json({
                                                        status: false,
                                                        msg: userFunctions.mongooseErrorHandle(err),
                                                        code: "E130"
                                                    });
                                                } else {

                                                

                                                    // SEND TO EMAIL
                                                    
                                                            ejs.renderFile('./views/templates/otpEmail.ejs',{name:`${result[0].f_name} ${result[0].l_name}`,toemail:email,otp:generateOtp},function(err,data){
                                                            console.warn(err);
                                                    
                                                            // co
                                                            // ready for email otp
                                                            var mailOptions = {
                                                                from: "Hypr", // sender address
                                                                to: email,                                        
                                                                subject: 'Hypr One Time Password',
                                                                html:      data,
                                                                attachments: [{
                                                                    filename: 'otp.jpeg',
                                                                    path: `${process.env.DEV_URL}/images/otp.jpeg`,
                                                                    cid: 'otp' //same cid value as in the html img src
                                                                },{
                                                                    filename: 'hypr-logo.png',
                                                                    path: `${process.env.DEV_URL}/images/hypr-logo.png`,
                                                                    cid: 'logo' //same cid value as in the html img src
                                                                }]
                                                            }
                                                            transporter.sendMail(mailOptions, function (error, info) {
                                                                if (error) {
                                                                    console.log('Error: ' + error);
                                                                    console.log('Error in forgot pass email sending' + error);
                                                                    res.json({
                                                                        status: false,
                                                                        msg: 'Email not sent',
                                                                        code: 'E110'
                                                                    });
                                                                } else {
                                                                    console.log('Email sent: ' + info.response);                                                                 
                                                                    
                                                                    res.json({
                                                                        status: true,
                                                                        msg: 'OTP Email sent successfuly',
                                                                        code: 'S405',
                                                                        data: updatedDocs
                                                                    });
                                                                }
                                                            });

                                                        });


                                            

                                            

                                                   
                                                }
                                        })
                                    } else {
                                        res.json({
                                            status: false,
                                            msg: "Incorrect email or password entered !",
                                            code: "E123"
                                        });
                                    }
                        }
                    }
                })

            }
            else {
                res.json({
                    status: false,
                    msg: "There is no account associated with this provider",
                    code: "E123"
                });
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

router.route("/logout")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    })

    .post((req, res, next) => {
        try {

            let _id = userFunctions.santizeInput(req.body._id);

            if (_id != null && _id != '') {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                    status: 1
                }, {
                    __v: 0,
                    createdAt: 0,
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
                            msg: "There is no account associated with this E-mail",
                            code: "E123"
                        });
                    } else {
                        //check for password

                        //generate new access token

                        let options = {
                            // accessToken: accessToken,
                            lastLogin: result[0].loginAt
                        };

                        UsersSchema.findByIdAndUpdate(result[0]._id, {
                            $set: options
                        }, {
                            fields: {
                                password: 0,
                                otp: 0,
                                createdAt: 0,
                                updatedAt: 0,
                                emailVerifiedFlag: 0,
                                phoneVerifiedFlag: 0,
                                __v: 0
                            },
                            new: true
                        }, (err, updatedDocs) => {
                            if (err) {
                                console.log("Error in user.findByIdAndUpdate login " + err);
                                res.json({
                                    status: false,
                                    msg: userFunctions.mongooseErrorHandle(err),
                                    code: "E130"
                                });
                            } else {
                                res.json({
                                    status: true,
                                    msg: 'User logged out successfully..',
                                    data: ""
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

router.route('/forgotpassword')
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    })

    .post((req, res, next) => {
        try {
            let email = userFunctions.santizeInput(req.body.email)
            if (email != null && email != '') {
                let verifyToken = sha1(email + Date.now())
                //check if the user exist
                userFunctions.findUserByEmail(email, (err, talentInfo) => {
                    if (err) {
                        console.log("error in fetchTalentByEmail forgotPassword " + err)
                        res.json({
                            status: false,
                            msg: userFunctions.mongooseErrorHandle(err),
                            code: 'E130'
                        })
                    } else if (talentInfo != null && talentInfo != '') {
                        //update verifyToken

                        let verifyMeLink = process.env.RESET_PASSWORD_URL + talentInfo._id;
                        console.log(verifyMeLink);
                        res.render('./templates/resetPasswordEmailer.ejs', {
                            email: email,
                            verifyMeLink: verifyMeLink,
                            userName: talentInfo.firstName
                        }, (err, html) => {
                            if (err) {
                                console.log("error in resetPasswordEmailer " + err)
                                res.json({
                                    status: false,
                                    msg: "Email could not be sent, please try again",
                                    code: "E110"
                                })
                            } else {
                                var transporter = nodemailer.createTransport({
                                    service: service,
                                    host: host,
                                    auth: {
                                        user: user,
                                        pass: pass
                                    }
                                });
                                var mailOptions = {
                                    from: "Hypr" + process.env.EMAILING_ACCOUNT, // sender address
                                    to: email,
                                    cc: 'atti7466@gmail.com',
                                    subject: 'Reset your password',
                                    html: html
                                }
                                // transporter.sendMail(mailOptions, (error, info) => {
                                //     if (error) {
                                //         console.log('Error in forgot pass email sending' + error);
                                //         res.json({
                                //             status: false,
                                //             msg: 'Email not sent',
                                //             code: 'E110'
                                //         });
                                //     } else {
                                //         res.json({
                                //             status: true,
                                //             msg: 'Email sent successfuly',
                                //             code: 'S405'
                                //         });
                                //     }
                                // })

                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log('Error: ' + error);
                                        console.log('Error in forgot pass email sending' + error);
                                        res.json({
                                            status: false,
                                            msg: 'Email not sent',
                                            code: 'E110'
                                        });
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                        res.json({
                                            status: true,
                                            msg: 'Email sent successfuly',
                                            code: 'S405'
                                        });
                                    }
                                });
                            }

                        })
                    } else {
                        res.json({
                            status: false,
                            msg: "invalid email/user does not exist",
                            code: 'E123'
                        })
                    }
                })
            } else {
                res.json({
                    status: false,
                    msg: 'E-mail ID missing',
                    code: 'E101'
                });
            }
        } catch (e) {
            console.log('Catch in v2/forgotpassword' + e);
            res.json({
                status: false,
                msg: genericErrorMessage,
                code: 'E130'
            });
        }
    })

router.route("/resetPassword")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    })

    .post((req, res, next) => {
        try {
            console.log(req.body)
            let _id = userFunctions.santizeInput(req.body._id);
            let password = userFunctions.santizeInput(req.body.password);
            let confirmPassword = userFunctions.santizeInput(req.body.confirmPassword);
            msg = "",
                errorArray = [];
            if (!userFunctions.checkPasswordFormat(password)) {
                msg = "Password must contain atleast 6 characters. 1 upper-case. 1 lower-case. 1 number. and 1 special character";
                errorArray.push(msg);
            }
            if (!validator.equals(password, confirmPassword)) {
                msg = "Password and confirm password didnt match"
                errorArray.push(msg);
            }
            // console.log(errorArray)
            // console.log(msg)
            if (errorArray.length == 0) {
                if (_id != null && _id != '') {
                    //fetch the username and password from db and check if they match
                    var options = {
                        f_password: (password),
                        updatedAt: Date.now()
                    }
                    UsersSchema.findByIdAndUpdate(_id, {
                        $set: options
                    }, {
                        fields: {
                            password: 0,
                            otp: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            emailVerifiedFlag: 0,
                            phoneVerifiedFlag: 0,
                            __v: 0
                        },
                        new: true
                    }, (err, updatedDocs) => {
                        if (err) {
                            console.log("Error in user.findByIdAndUpdate login " + err);
                            res.json({
                                status: false,
                                msg: userFunctions.mongooseErrorHandle(err),
                                code: "E130"
                            });
                        } else {
                            res.json({
                                status: true,
                                msg: 'user password changed successfully..',
                                data: updatedDocs
                            });
                        }
                    })

                }
                else {
                    res.json({
                        status: false,
                        code: "E130",
                        msg: "userId not exists!"
                    })
                }
            } else {
                res.json({
                    status: false,
                    code: "E130",
                    msg: errorArray
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

router.route("/editUser")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    })

    .post((req, res, next) => {
        try {

            let _id = userFunctions.santizeInput(req.body._id);
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
                            msg: "There is no account associated with this E-mail",
                            code: "E123"
                        });
                    } else {
                        res.json({
                            status: false,
                            msg: "User data fetched successfully",
                            data: result
                        });
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


router.route("/updateUser")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    })

    .post((req, res, next) => {
        try {
            console.warn(req.body);
            // return

            let fname = userFunctions.santizeInput(req.body.firstName),
                lname = userFunctions.santizeInput(req.body.lastName),
                email = userFunctions.santizeInput(req.body.email),
                phone = userFunctions.santizeInput(req.body.mobileNo),
                uname = userFunctions.santizeInput(req.body.username),
                country = userFunctions.santizeInput(req.body.countryCode),
                dob = userFunctions.santizeInput(req.body.dob),
                about = userFunctions.santizeInput(req.body.about),
                address = userFunctions.santizeInput(req.body.address),
                signupType = userFunctions.santizeInput(req.body.signupType),
                //signupType >> 1 = buyer, 0 = seller
                // dob = userFunctions.toDate(userFunctions.santizeInput(req.body.dob)),
                age = userFunctions.santizeInput(req.body.age),
                profilePhoto = req.body.profilePhoto,
                countryCode = userFunctions.santizeInput(req.body.countryCode),
                password = userFunctions.santizeInput(req.body.password),
                confirmPassword = userFunctions.santizeInput(req.body.confirmPassword)
            _id = userFunctions.santizeInput(req.body._id),
                // profilePhoto = req.files.profilePhoto,
                // document = req.files.document,
                // alternatePhone = userFunctions.santizeInput(req.body.alternatePhone),
                // alternateEmail = userFunctions.santizeInput(req.body.alternateEmail),
                // representedBy = Number(userFunctions.santizeInput(req.body.representedBy)),
                // representedId = userFunctions.santizeInput(req.body.representedId),
                // peopleId = userFunctions.santizeInput(req.body.peopleId),
                msg = "",
                errorArray = [];
            console.log(fname, lname, email, phone, uname, country, dob, age, password, confirmPassword);
            // if (fname != null && fname != '' && lname != null && lname != '' && email != null && email != '' && phone != null && phone != ''
            //     && uname != null && uname != '' && country != null && country != '' && dob != null && dob != ''
            //     && age != null && age != '' && password != null && password != '' && confirmPassword != null
            //     && confirmPassword != '') {

            // if (!validator.isEmail(email)) {
            //     msg = "Invalid email, please try again";
            //     errorArray.push(msg);
            // }


            // if (!validator.isMobilePhone(phone)) {
            //     msg = "Invalid phone number, please try again";
            //     errorArray.push(msg);
            // }


            // if (age < 13) {
            //     msg = "user's age should be grater than 13 years.;";
            //     errorArray.push(msg);
            // }
            console.log(errorArray);
            if (errorArray.length == 0) {
                //check if the email already exists, if yes then this user was invited
                // userFunctions.checkEmailInvitationExists(email, (result, agencyId) => {
                //  if (result == true) {
                //update the existing data with the email
                //save the data to db
                let key = Date.now() + email;
                let accessToken = sha1(key);
                let options = {
                    f_name: fname,
                    l_name: lname,
                    profilePhoto: profilePhoto,
                    f_picture: profilePhoto,
                    f_phone: phone,
                    f_address: address,
                    f_about: about,
                    f_country: countryCode,
                    updatedAt: Date.now()
                }
                console.log(options);
                // UsersSchema.create(options, (err, insertRes) => {
                UsersSchema.findByIdAndUpdate(_id, {
                    $set: options
                }, {
                    fields: {
                        password: 0,
                        otp: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        emailVerifiedFlag: 0,
                        phoneVerifiedFlag: 0,
                        __v: 0
                    },
                    new: true
                }, (err, insertRes) => {
                    if (err) {
                        console.log("Err in inserting talent " + err);
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
                            msg: "Successfully updated user data!",
                            id: _id
                        })
                        // } else {
                        //     res.json({
                        //         status: false,
                        //         code: "E110",
                        //         msg: 'Could not send email OTP, data saved'
                        //     })
                        // }
                        return
                        userFunctions.sendMailOtpToVerifyTalentEmailId(insertRes._id, (result) => {
                            if (result == true) {
                                res.json({
                                    status: true,
                                    code: "S405",
                                    msg: "Successfully sent email OTP, data saved",
                                    id: insertRes._id
                                })
                            } else {
                                res.json({
                                    status: false,
                                    code: "E110",
                                    msg: 'Could not send email OTP, data saved'
                                })
                            }
                        })
                    } else {
                        res.json({
                            status: false,
                            code: "E111",
                            msg: "Could not create talent, try again."
                        })
                    }
                })
                // }
                // })
            } else {
                res.json({
                    status: false,
                    code: "E130",
                    msg: errorArray
                })
            }

            // } else {
            //     res.json({
            //         status: false,
            //         code: "E101",
            //         msg: "Please fill mandatory field(s)"
            //     })
            // }


        } catch (e) {
            console.log("Catch in usersignup api " + e);
            res.json({
                status: false,
                code: "E109",
                msg: genericErrorMessage
            })
        }
    })


router.route("/changePassword")
    .get((req, res, next) => {
        res.json({
            status: false,
            code: "E131"
        })
    })

    .post((req, res, next) => {
        try {

            let _id = userFunctions.santizeInput(req.body._id);
            let newPassword = userFunctions.santizeInput(req.body.newPassword);
            let oldPassword = userFunctions.santizeInput(req.body.oldPassword);
            msg = "",
                errorArray = [];
            if (!userFunctions.checkPasswordFormat(newPassword)) {
                msg = "Password must contain atleast 6 characters. 1 upper-case. 1 lower-case. 1 number. and 1 special character";
                errorArray.push(msg);
            }
            // if (!validator.equals(newPassword, confirmPassword)) {
            //     msg = "Password and confirm password didnt match"
            //     errorArray.push(msg);
            // }
            if (_id != null && _id != '') {
                //fetch the username and password from db and check if they match

                UsersSchema.find({
                    _id: mongoose.Types.ObjectId(_id),
                    status: 1
                }, {
                    __v: 0,
                    createdAt: 0,
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
                            msg: "There is no account associated with this E-mail",
                            code: "E123"
                        });
                    } else {
                        //check for password

                        //generate new access token

                        if (result[0].password == sha1(oldPassword)) {
                            var options = {
                                f_password: sha1(newPassword),
                                updatedAt: Date.now()
                            }
                            UsersSchema.findByIdAndUpdate(result[0]._id, {
                                $set: options
                            }, {
                                fields: {
                                    password: 0,
                                    otp: 0,
                                    createdAt: 0,
                                    updatedAt: 0,
                                    emailVerifiedFlag: 0,
                                    phoneVerifiedFlag: 0,
                                    __v: 0
                                },
                                new: true
                            }, (err, updatedDocs) => {
                                if (err) {
                                    console.log("Error in user.findByIdAndUpdate login " + err);
                                    res.json({
                                        status: false,
                                        msg: userFunctions.mongooseErrorHandle(err),
                                        code: "E130"
                                    });
                                } else {
                                    res.json({
                                        status: true,
                                        msg: 'User change profile successfully..',
                                        data: updatedDocs
                                    });
                                }
                            })
                        }
                        else {
                            res.json({
                                status: false,
                                msg: 'old password not mactched..',
                                data: ""
                            });
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

router.route("/network")
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
                        var Network = await UsersSchema.find({ "ReferCodeBy": req.body.refCode });
                        console.log(Network)
                        if (Network.length > 0) {
                            res.json({
                                status: true,
                                msg: "Network Fatch Succefully!",
                                data: Network
                            })
                        }
                        else {
                            res.json({
                                status: false,
                                msg: "Network not Found!",
                                data: Network
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


module.exports = router;