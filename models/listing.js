
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Review=require("./Review.js")
// const User=require("./user.js")

const defaultImageURL = "https://images.unsplash.com/photo-1652469280598-48842f46be29?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvcGVydHklMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D";
const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url:String,
        filename:String
    },
    price: {
        type: Number,
        min: [0, "Price cannot be negative"]
    },
    location: String,
    country: String,
    reviews:[
       {
         type:Schema.Types.ObjectId,
        ref:"Review"
       }
    ],
    owner:
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }

    
});



listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){

        await Review.deleteMany({_id:{$in : listing.reviews}})
    }
})



const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;



// const mongoose=require("mongoose");

// const Schema=mongoose.Schema;

// const listingSchema=new Schema({
//     title:{
//         type:String,
//         required:true
//     },
//     description:String,
//     image:{
//         type:String,
//         default:"http://istockphoto.com/photo/cityscape-of-a-residential-area-with-modern-apartment-buildings-new-green-urban-gm1223072133-359135940?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fvilla-image&utm_medium=affiliate&utm_source=unsplash&utm_term=villa+image%3A%3A%3A",
//         set:(v)=>v==""?
//         "http://istockphoto.com/photo/cityscape-of-a-residential-area-with-modern-apartment-buildings-new-green-urban-gm1223072133-359135940?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fvilla-image&utm_medium=affiliate&utm_source=unsplash&utm_term=villa+image%3A%3A%3A":v,
//     },
//     price:Number,
//     location:String,
//     country:String
// })


// const Listing= mongoose.model("Listing",listingSchema);

// module.exports=Listing;