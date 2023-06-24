// multer used to handle our multi-part data
// sharp is used to modify our images like change the dimensions, foramt, and quality.
// path because we need our images to store in local after that we will upload it to the cloud.
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

/* 
there are two types of storage 
- disk storage.
- memory storage.
*/
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      {
        message: "UnSupported File Foramt",
      },
      false
    );
  }
};

// set up multer

const uploadPhoto = multer({
  // accept three things
  storage: multerStorage,
  fileFilter: multerFilter,
  limit: { fieldSize: 2000000 }, // 2MB
});

const productImageResize = async (req, res, next) => {
  if (!req.files) {
    return next();
  }
  await Promise.all(
    req.files.map(async(file)=>{
        await sharp(file.path).resize(300,300).toFormat('jpeg').jpeg({quality : 90}).toFile(`public/images/produts/${file.filename}`)
    })
  )
  next();
};



const blogImageResize = async (req, res, next) => {
    if (!req.files) {
      return next();
    }
    await Promise.all(
      req.files.map(async(file)=>{
          await sharp(file.path).resize(300,300).toFormat('jpeg').jpeg({quality : 90}).toFile(`public/images/blogs/${file.filename}`)
      })
    )
    next();
  };

module.exports = { uploadPhoto, productImageResize, blogImageResize};
