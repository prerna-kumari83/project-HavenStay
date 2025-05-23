require('dotenv').config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const Review = require("./models/Review");
const session = require('express-session');
const cookieParser = require("cookie-parser");
const ExpressError = require("./util/ExpressError");
const listingRouter = require("./routers/listing");
const reviewRouter = require("./routers/review");
const userRouter = require("./routers/user");
const MongoStore = require('connect-mongo');

const app = express();
const port = 8080;



// // MongoDB Connection
// const dburl = process.env.ATLASDB_URL;
// mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log("MongoDB Connected!"))
//     .catch(err => console.error("MongoDB Connection Error:", err));


const dburl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("MONGO IS CONNECTED!")
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dburl);
  
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }



const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:"harrypotterandhalfbloodprience",
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})


// Session options with environment variable secret
const sessionOptions = {
    store,    //store:store
    secret:  "harrypotterandhalfbloodprience",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

// Middleware
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(session(sessionOptions));
app.use(flash());




// Passport Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Flash Messages Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user || null;
    next();
});

// Routes
app.use("/listing", listingRouter);
app.use("/listing/:id/review", reviewRouter);
app.use("/", userRouter);

// Sample User Creation Route

app.get("/userdata",async(req,res)=>{
        let fakeUser=new User({
            email:"student1@gmail.com",
            username:"sham"
        });
    
        let reg=await User.register(fakeUser,"harrypotter");
        res.send(reg);
    })

// Error Handling for Undefined Routes
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

// Global Error Handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    console.error("Error:", err);
    res.status(status).render("./listing/error.ejs", { err });
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});






// require('dotenv').config()
// if(process.env.NODE_ENV!="production"){
//     console.log(process.env.SECRET)
// }



// const express=require("express");
// const app=express();

// const path=require("path");
// //  --------> <--body--->
// const mongoose=require("mongoose");


// const cloudinary = require("cloudinary").v2;
// const ejsMate=require('ejs-mate');  
// app.engine('ejs',ejsMate);

// const listingRouter=require("./routers/listing.js")
// const reviewRouter=require("./routers/review.js")
// const userRouter=require("./routers/user.js")

// const port=8080;
// const ExpressError=require("./util/ExpressError.js");

// const methodOverride = require('method-override');
// const flash = require('connect-flash');

// const passport=require("passport");
// const LocalStrategy=require("passport-local");
// const User=require("./models/user.js");
// const Review=require("./models/Review.js");


// const cookieParser = require("cookie-parser");
// const session = require('express-session');
// app.use(flash());

// const sessionOptions = {
//     secret: "harrypotterandhalfbloodprience",
//     resave: false,
//     saveUninitialized: true,
//     cookie:{
//         expires:Date.now() + 7 * 24*60*60*1000,
//         maxAge:7 * 24*60*60*1000,
//         httpOnly:true
//     }

// };



// app.use(session(sessionOptions));


// app.use(express.static(path.join(__dirname,"/public")));

// app.use(express.urlencoded({extended:true}))

// app.set("view engine","ejs");
// app.set("views",path.join(__dirname,"views"));

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// const dburl=process.env.ATLASDB_URL;

// main().then(()=>{
//     console.log("MONGO IS CONNECTED!")
// }).catch(err => console.log(err));

// async function main() {
//   await mongoose.connect(dburl);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
// }
// app.use(methodOverride("_method"));



// app.use((req,res,next)=>{
//     res.locals.success=req.flash("success");  
//     res.locals.error=req.flash("error"); 
//     res.locals.curUser=req.user; 
//     //  ^---list
 
//     next();
//     //must call else it will hang there.
// })







// // const { deleteImage } = require("./cloudConfig");

// // app.get("/deleteupload/:publicId", async (req, res) => {
// //     try {
// //         const { publicId } = req.params;
// //         const result = await cloudinary.uploader.destroy(publicId);
// //         console.log("Delete result:", result);
// //         res.send({ success: true, message: "Image deleted successfully", result });
// //     } catch (err) {
// //         console.error("Error deleting image:", err);
// //         res.status(500).send({ success: false, message: "Failed to delete image" });
// //     }
// // });


// app.get("/userdata",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student1@gmail.com",
//         username:"sham"
//     });

//     let reg=await User.register(fakeUser,"harrypotter");
//     res.send(reg);
// })

// app.use("/listing",listingRouter)
// app.use("/listing/:id/review",reviewRouter)
// app.use("/",userRouter)

// // app.get("/test", async (req,res)=>{
// //     const sample=new Listing({
// //         title:"new home",
// //         description:"Beautiful view",
// //         price:20000,
// //         location:"Dheradun",
// //         country:"India"
// //     })

// //      await sample.save().then(res=>{
// //         console.log(res);
// //      }).catch(err=>{
// //         console.log(err)
// //      })


// //      console.log("Data is saved");
// //      res.send("data send successfully..");
// // })



// // reviews post


// app.use('/random', (req, res, next) => {
//     next(new ExpressError(404, "Page not found!"));    
// });

// //app.all("*")-------------------?

// app.use((err,req,res,next)=>{
//     let {status=500,message="something went wrong"}=err;

//     console.log(err);

//     res.status(status).render("./listing/error.ejs",{err});     
//     //it will search in views but after that i have to give dir.
// })

// app.listen(port,()=>{
//     console.log("Server is listening to port 8080...");
// })


















// const express = require("express");
// const app = express();
// const path = require("path");
// const mongoose = require("mongoose");

// const { listSchema } = require("./schema.js");
// const ejsMate = require("ejs-mate");
// const methodOverride = require("method-override");
// const wrapAsync = require("./util/wrapAsync.js");
// const ExpressError = require("./util/ExpressError.js");
// const Listing = require("./models/listing.js");

// const port = 8080;

// // Setup
// app.engine("ejs", ejsMate);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));

// // DB connection
// main().then(() => console.log("MONGO IS CONNECTED!")).catch(err => console.log(err));
// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
// }

// // Validation middleware
// const validateSchema = (req, res, next) => {
//   const { error } = listSchema.validate(req.body);
//   if (error) {
//     const msg = error.details.map(el => el.message).join(",");
//     throw new ExpressError(400, msg);
//   } else {
//     next();
//   }
// };

// // Routes
// app.get("/", (req, res) => res.send("done!"));

// app.get("/listing/new", (req, res) => {
//   res.render("listing/create");
// });

// app.post("/listing", validateSchema, wrapAsync(async (req, res) => {
//   const newListing = new Listing(req.body.list);
//   await newListing.save();
//   res.redirect("/listing");
// }));

// app.get("/listing", wrapAsync(async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listing/index", { allist: allListings });
// }));

// app.get("/listing/:id", wrapAsync(async (req, res) => {
//   const { id } = req.params;
//   const listData = await Listing.findById(id);
//   res.render("listing/show", { listData });
// }));

// app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
//   const { id } = req.params;
//   const data = await Listing.findById(id);
//   res.render("listing/edit", { data });
// }));

// app.put("/listing/:id", validateSchema, wrapAsync(async (req, res) => {
//   const { id } = req.params;
//   await Listing.findByIdAndUpdate(id, { ...req.body.list });
//   res.redirect(`/listing/${id}`);
// }));

// app.delete("/listing/:id", wrapAsync(async (req, res) => {
//   const { id } = req.params;
//   await Listing.findByIdAndDelete(id);
//   res.redirect("/listing");
// }));

// // Error handling
// app.use('/random', (req, res, next) => {
//   next(new ExpressError(404, "Page not found!"));
// });

// app.use((err, req, res, next) => {
//   const { status = 500, message = "Something went wrong!" } = err;
//   res.status(status).render("listing/error", { message });
// });

// app.listen(port, () => {
//   console.log("Server is listening to port 8080...");
// });






