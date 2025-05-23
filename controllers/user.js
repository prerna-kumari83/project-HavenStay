const User=require("../models/user.js");

module.exports.renderSignForm=(req,res)=>{
   
    res.render("./user/signup.ejs")
}

module.exports.signUp=async(req,res)=>{
        //due to wrapAsync we are directed to ramdom page so preventing this we use try and catch.
    try{
         let{username,email,password }=req.body;
    let newUser=new User({username,email});
    let newRegisteredUser= await User.register(newUser,password);
    console.log(newRegisteredUser);
    req.login(newRegisteredUser,(err)=>{
        if(err){
            return next(err);
        }

        req.flash("success","Welcome TO WonderLust!");
        res.redirect("/listing");
    })
   
    }

    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }

   
    

}

module.exports.renderLoginForm=(req,res)=>{
    res.render("./user/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","WelcomeBack to Wonder Lust!");
    let redirectto=res.locals.redirectUrl || '/listing';
                                    //as while login isloggedin  middleware is not invoked so we need to have alter native path as well.
    res.redirect(redirectto);


}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
       if(err){
         return next(err);
       }
       req.flash("success","you are successfully logout!");
    res.redirect("/listing");
    })

    
}