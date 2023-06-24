const cloudinary = require("cloudinary");

// Now We Need three Things
// Cloud name, API Key, Secret Key

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET,
});

const cloudinaryUploadImg = async (fileToUpload) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(fileToUpload, (result) => {
      resolve({
        url: result.secure_url,
      },{
        resource_type : 'auto'
      });
    });
  });
};

module.exports = cloudinaryUploadImg;