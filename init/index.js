const mongoose=require("mongoose");

const initData=require("./data.js");   //return {}
const Listing = require("../models/listing.js");

main().then(()=>{
    console.log("MONGO IS CONNECTED!")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const initDb=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"680d32cc1fc17cf9ed85c65a"}));
    await Listing.insertMany(initData.data);
    console.log("done");
}

initDb();