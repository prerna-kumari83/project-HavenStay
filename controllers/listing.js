const Listing =require("../models/listing");


// have all functionality

module.exports.index=async (req,res)=>{

    const allist=await Listing.find({});
    // console.log(allist);
   res.render("./listing/index.ejs",{allist});

}
 
module.exports.renderNewForm= async(req,res)=>{
    console.log("working");
    res.render("./listing/create.ejs");

}
module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listData=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");     //we have to give nested populate.    

    if(!listData){
        req.flash("error","Listing Does Not Exit!");
        
        return res.redirect("/listing");

    }
    // console.log(listData.owner.username);
    res.render("./listing/show.ejs",{listData});

}

module.exports.renderEditForm=async (req,res)=>{
    let{id}=req.params;
    const data=await Listing.findById(id);
    if(!data){
        req.flash("error","Listing Does Not Exit! Can't Update!");
        return res.redirect("/listing");

    }
    let originalImageUrl=data.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/ar_1.0,c_fill,w_250/r_max/f_auto");
    
    
    res.render("./listing/edit.ejs",{data,originalImageUrl});
}

module.exports.createListing=async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"------",filename)
    
    const newData=new Listing(req.body.list);   
    newData.owner=req.user._id; 
    newData.image={url,filename};
    await newData.save();
    req.flash("success","New Listing Created!");


      res.redirect("/listing");
  //it will be object  the we have created in creat form in name.
                                                    // console.log(req.body)    //here {list:{title:input,....}}}
  // let {title,description,price,location,country}=req.body;
    // const newData=new Listing({
    //     title:title,
    //     description:description,
    //     price:price,
    //     location:location,
    //     country:country
    // })
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    console.log("deleted");
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");

}

module.exports.updateListing= async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.list});
    console.log("listing",'---',listing);
    if (typeof req.file !== "undefined") {
        let url=req.file.path;
        let filename=req.file.filename;

        listing.image={url,filename};
        console.log(listing);

         await listing.save();
        
        

    }

    req.flash("success"," Listing Updated!");
    // console.log(req.body.list);
    res.redirect(`/listing/${id}`);
    
}