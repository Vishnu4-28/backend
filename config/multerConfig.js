
// const upload = require("../uploads/Product_img")
const multer = require("multer");
const path = require('path')
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