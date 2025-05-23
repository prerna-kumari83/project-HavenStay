const express=require("express");
const router=express.Router();

const User=require("../models/user.js");
const wrapAsync = require("../util/wrapAsync");
const passport = require("passport");
const {saveOriginalUrl}=require('../middleware.js')


const userController=require("../controllers/user.js");

router.route("/signup")
    .get(userController.renderSignForm)
    .post(wrapAsync(userController.signUp));


router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveOriginalUrl,passport.authenticate('local', 
        { failureRedirect: '/login',
            failureFlash:true 
        }),
        userController.login
    )

router.get("/logout",userController.logout);

// router.get("/signup",userController.renderSignForm);

// router.post('/signup',wrapAsync(userController.signUp));

// router.get("/login",userController.renderLoginForm);


// router.post("/login",saveOriginalUrl,passport.authenticate('local', 
//     { failureRedirect: '/login',
//         failureFlash:true 
//     }),
//     userController.login
// )



module.exports=router;