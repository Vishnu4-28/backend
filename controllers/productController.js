const Product = require("../models/Product");
const User = require("../models/User");
const Cart_Data = require("../models/Cart");
const path = require('path')



exports.addProduct = async (req, res) => {
  try {
    const { product_name, price  } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }
      console.log("userId",req.body.user)
    const img = req.file.filename;
    const newProduct = new Product({ product_name, price, img});
    const savedProduct = await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: savedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserProducts = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("userid--",userId);
    const products = await Product.find({ user: userId });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.addCart = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { id } = req.params;
    const {count} = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newCart = new Cart_Data({
      user: userId,
      product_name: product.product_name,
      price: product.price,
      img: product.img,
      count: count,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
      console.log("userr",newCart)
    const savedCart = await newCart.save();

    res.status(201).json({ message: "Product added to cart successfully", cartItem: savedCart });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("userid--",userId);
    const carts = await Cart_Data.find({ user: userId });

    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCartProduct = async (req,res) =>{
  try{
    const userId = req.user.userId;
    const productId = req.params.id;
    const Carts = await Cart_Data.find({ user: userId });
    console.log("carts",Carts)
    const deletedProduct  = await Cart_Data.findByIdAndDelete({ user : userId , _id : productId});
    if (!deletedProduct) return res.status(404).json({ message: "Product not found in cart" });
    res.status(200).json({ message: "Product deleted successfully" });
   } catch (err) {
     res.status(500).json({  error: err.message });
   }
}

exports.viewCart = async (req,res) =>{
  try {
    const carts = await Cart_Data.find({});
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

exports.updateProduct =  async (req,res) =>{
  console.log("img-->",req.body);
  try{
    const { product_name, price } = req.body;
    const { id } = req.params;   
    const updateData = { product_name, price };
    if (req.file) {
      updateData.img = req.file.filename;
    }
    console.log("updateData-->",updateData)
     let updatedProduct = await Product.findByIdAndUpdate(id,updateData ,{new : true , useFindAndModify: false});
     if (!updatedProduct) {
     return res.status(404).json({ error: "Product not found" });
      }
     res.status(200).json({ message: "Product Updated successfully", product: updatedProduct });
   }catch(err){
     res.status(500).json({ message: "server error"});
   }
 }

exports.deleteProduct = async (req ,res) =>{
  console.log("res",req.params.id)
  try{
   const ProductId = await Product.findByIdAndDelete(req.params.id);
   if (!ProductId) return res.status(404).json({ message: "Product not found" });
   res.status(200).json({ message: "Product deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}




// exports.getProducts = async (req, res) => {
//   try {
//     const products = await Product.find({}).sort({ createdAt: -1 });
//     const productsWithImageUrl = products.map((product) => ({
//       ...product._doc,
//       img: `${req.protocol}://${req.get("host")}/uploads/Product_img/${product.img}`, // Construct full URL
//     }));

//     res.status(200).json({ success: true, products: productsWithImageUrl });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };