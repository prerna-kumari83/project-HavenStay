const express=require("express");
const app=express();

const path=require("path");
const session=require("express-session");

const flash=require("connect-flash");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));



const sessionOptions={secret:"harrypotterandhalfbloodprince",resave:false,saveUninitialized:true};


app.use(session(sessionOptions));
app.use(flash());
app.use(cookieParser("secretcode"));


app.get("/getcookies",(req,res)=>{
    res.cookie("madein","INDIA");
    res.cookie("greet","namaste");
    res.send("get the cookies");
})


app.get("/verify",(req,res)=>{

   console.log(req.signedCookies);

   res.send("verified!");
})

app.get("/",(req,res)=>{

    let {madein="bharat",name="anonymous"}=req.cookies;
    console.log(req.cookies)

    
    
    res.send(`HI ${name} ,the product is from  ${madein}`);
})




app.get("/getsigncookies",(req,res)=>{
    res.cookie("color","blue",{signed:true});

    res.send("send the signed cookies!");
})



app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    next();
    
})

app.get("/register",(req,res)=>{

    let {name='anonymous'}=req.query;

    req.session.name=name;

    if(name==="anonymous"){
         req.flash("error","user not register!");
         
    }
    else{
        req.flash("success","user register successfully!");
        
    }

   
    res.redirect("/hello");

})

app.get("/hello",(req,res)=>{


   

    res.render("page.ejs",{name:req.session.name})

})


// In different browsers: Sessions are specific to the browser.
//  If you open a new browser (e.g., Chrome and Firefox), 
//  the session data is isolated. In a new browser, req.session.
//  count will start from 1 again, as the session 
//  cookie is not shared across browsers.

app.get("/test",(req,res)=>{

    //let define a new variable from counting  req in diff tab.
    if(req.session.count){
        req.session.count++;
    }
    else{

    req.session.count=1;
    }

    res.send(`the number of request is ${req.session.count}`);
})


app.listen(3030,()=>{
    console.log("listening to the port 3030...");
})



// const express = require("express");
// const app = express();

// const session = require("express-session");

// app.use(session({
//     secret: "harrypotterandhalfbloodprince", 
//     resave: false, 
//     saveUninitialized: true
// }));

// app.get("/test", (req, res) => {
//     res.send("Test successful!");
// });

// app.listen(3030, () => {
//     console.log("Listening on port 3030...");
// });
