const Listing=require("./models/listing");
const ExpressError=require("./util/ExpressError.js");
const {listSchema,reviewSchema}=require("./schema.js");
const Review = require("./models/Review.js");



module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req.path,"...",req.originalUrl);

    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you need to login for any action!");
        return res.redirect("/login");
    }

    next();
    


}

module.exports.saveOriginalUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
   next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);

    if(!listing.owner.equals(res.locals.curUser._id)){
        req.flash("error","you are not owner of this listing!");
        return res.redirect(`/listing/${id}`);
                                                 //listing.owner -->new objectId("68233aa31008244daf3d4279")
                                                 //curUser--.have all data of loggedin person so fetch id.
}   
next();
}



module.exports.validateSchema=(req,res,next)=>{
    console.log(listSchema.validate(req.body));
    let {error}=listSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>
        el.message).join(",");
    
        console.log(error);
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}


module.exports.validateReview=(req,res,next)=>{

    let {error}=reviewSchema.validate(req.body);

    if(error){
        let errMsg=error.details.map((el)=>
        el.message).join(",");
        console.log(errMsg);
        console.log(error);
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }

}


module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);

    if(!review.author.equals(res.locals.curUser._id)){
        req.flash("error","you are not author of this review!");
        return res.redirect(`/listing/${id}`);
                                                 //listing.owner -->new objectId("68233aa31008244daf3d4279")
                                                 //curUser--.have all data of loggedin person so fetch id.
}   
next();
}

