
// const upload = require("../uploads/Product_img")
const cloudinary = require('cloudinary').v2;
const multer = require("multer");
const path = require('path')
const fs = require('fs');


cloudinary.config({
  cloud_name: 'dbk24uzxg',
  api_key: '876843186822369',
  api_secret: 'mm-ILICGyqS_RdrYOOhjAiWNDXU'
});

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });


const profilePicUploadDir = path.resolve(__dirname, '../uploads/Product_img');
const userProfileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, profilePicUploadDir)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const filename = Date.now() + ext
    cb(null, filename)
  },
})

exports.upload = multer({ storage: userProfileStorage });


exports.uploadToCloudinary = async (localFilePath, folderName = 'products') => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: folderName,
    });

    fs.unlinkSync(localFilePath);

    return result;
  } catch (error) {
    console.error('Cloudinary Upload Failed:', error);
    throw error;
  }
};

