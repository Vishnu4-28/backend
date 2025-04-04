const express = require("express");
const { addProduct, getProducts,deleteProduct,updateProduct } = require("../controllers/productController");
const router = express.Router();
const {upload} =  require("../config/multerConfig");


router.post("/",upload.single('ProductPic'),addProduct);
router.get("/Allproducts",getProducts);
router.delete("/delete/:id",deleteProduct);
router.put("/productUpdate/:id",upload.single('ProductPic'),updateProduct)
module.exports = router;