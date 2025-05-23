const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_APT_SECRET
})


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wonderlust_Dev',
     allowedFormets:["png","jpg","jpeg"] // supports promises as well

    },
  });

//   async function deleteImage(publicId) {
//     try {
//         const result = await cloudinary.uploader.destroy(publicId);
//         console.log("Delete result:", result);
//         return result;
//     } catch (err) {
//         console.error("Error deleting image:", err);
//         throw err;
//     }
// }

// // Example Usage: Delete an image with a specific public ID
// deleteImage("wonderlust_Dev/glrm5cv1wcltyijlrqiu");


  module.exports={
    cloudinary,
    storage
  }