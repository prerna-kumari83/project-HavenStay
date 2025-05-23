const express=require("express");
const router=express.Router();

const wrapAsync=require("../util/wrapAsync.js");

const Listing=require("../models/listing.js");

const {isLoggedIn,isOwner,validateSchema}=require("../middleware.js")

const listingController=require("../controllers/listing.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");

const upload = multer({ storage })

router.route("/")
    .get(wrapAsync(listingController.index ))
    .post(isLoggedIn, validateSchema,upload.single('list[image]'),wrapAsync(listingController.createListing))
   
router.get("/new",isLoggedIn,listingController.renderNewForm)

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))
    .put(isLoggedIn,isOwner,upload.single('list[image]'),validateSchema,wrapAsync( listingController.updateListing))

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm))

//new route





//show route

// router.get("/:id", wrapAsync(listingController.showListing))
//create route

// router.post("/",isLoggedIn, validateSchema,wrapAsync(listingController.createListing))


//edit route



//index route

// router.get("/",wrapAsync(listingController.index ))

//delete route

// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

//update route

// router.put("/:id",isLoggedIn,isOwner,validateSchema,wrapAsync( listingController.updateListing))

module.exports=router;