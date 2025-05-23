const Listing=require("../models/listing")
const Review=require("../models/Review");

module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newreview= new Review(req.body.review);

    listing.reviews.push(newreview);
    newreview.author=req.user._id;
    console.log(newreview);

    await listing.save();
    req.flash("success","New Review Created!");
    let rel=await newreview.save();
    
   res.redirect(`/listing/${listing._id}`)
}

module.exports.destroyReview=async(req,res)=>{
  
    let {id , reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    

    //it will pullout the review from listing reviews list
    await Review.findByIdAndDelete(reviewId);
     req.flash("success","Review Deleted!");

    res.redirect(`/listing/${id}`);

}