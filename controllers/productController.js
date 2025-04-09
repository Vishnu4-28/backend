const Product = require("../models/Product");
const User = require("../models/User");
const Cart_Data = require("../models/Cart");
const path = require('path')

const {uploadToCloudinary} = require('../config/multerConfig')

exports.addProduct = async (req, res) => {
  try {
    const { product_name, price  } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const localFilePath = req.file.path;

    const cloudinaryResult = await uploadToCloudinary(localFilePath, 'products');

    const img = cloudinaryResult.secure_url;

      console.log("userId",req.body.user)
    // const img = req.file.filename;
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
      const productToAdd = {
        product_name: product.product_name,
        price: product.price,
        img: product.img,
        count: count || 1,
      }

    let cart = await Cart_Data.findOne({ user: userId });


    if(!cart){
      const newCart = new Cart_Data({
        user: userId,
        // product_name: product.product_name,
        // price: product.price,
        // img: product.img,
        // count: count,
        products: [productToAdd],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      });
    }else {
      
      const existingProductIndex = cart.products.findIndex(
        (p) => p.product_name === product.product_name
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].count += count || 1;
      } else {

        cart.products.push(productToAdd);
      }
    }

 // const newCart = new Cart_Data({
    //   user: userId,
    //   // product_name: product.product_name,
    //   // price: product.price,
    //   // img: product.img,
    //   // count: count,
    //   products: [productToAdd],
    //   createdAt: product.createdAt,
    //   updatedAt: product.updatedAt,
    // });
      console.log("userr",cart)
    const savedCart = await cart.save();

    res.status(201).json({ message: "Product added to cart successfully",    cartItem: savedCart });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("userid--", userId);

    const carts = await Cart_Data.find({ user: userId });

    let updatedCarts = [];
    let grandTotal = 0;

    for (let cart of carts) {
      let productTotals = [];
      let cartTotal = 0;

      for (let product of cart.products) {
        const totalAmount = product.price * product.count;
        cartTotal += totalAmount;
        productTotals.push({
          ...product._doc, 
          totalAmount,
        });
      }

      grandTotal += cartTotal;

      updatedCarts.push({
        ...cart._doc,
        products: productTotals,
        cartTotal,
      });
    }

    res.status(200).json({
      carts: updatedCarts,
      totalCartAmount: grandTotal,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.removeCartProduct = async (req, res) => {
  try {
    const userId = req.user.userId;
    const productId = req.params.id;

    const cart = await Cart_Data.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    let productFound = false;

    const updatedProducts = cart.products
      .map((product) => {
        if (!product._id) return product;

        if (product._id.toString() === productId) {
          productFound = true;
          if (product.count > 1) {
            return {
              ...product._doc,
              count: product.count - 1,
            };
          } else {

            return null;
          }
        }
        return product;
      })
      .filter(Boolean);

    if (!productFound) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.products = updatedProducts;
    await cart.save();

    res.status(200).json({ message: "Product updated in cart successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
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