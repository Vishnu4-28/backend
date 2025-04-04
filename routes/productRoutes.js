const express = require("express");
const { addProduct, getProducts,deleteProduct,updateProduct,addCart,viewCart,getUserProducts,getUserCart,deleteCartProduct} = require("../controllers/productController");
const router = express.Router();
const {upload} =  require("../config/multerConfig");
const authMiddleware  = require('../middleware/authMiddleware');

router.post("/",upload.single('ProductPic'),authMiddleware,addProduct);
router.post("/cart/:id",authMiddleware,addCart);
router.get("/Allproducts",getProducts);
router.get("/viewCart",viewCart);
router.get("/getUserCart",authMiddleware,getUserCart);
router.get("/getUserProducts",authMiddleware,getUserProducts) ;
router.delete("/delete/:id",deleteProduct);
router.delete("/deleteCartProduct/:id",authMiddleware,deleteCartProduct);
router.put("/productUpdate/:id",upload.single('ProductPic'),updateProduct);
module.exports = router;