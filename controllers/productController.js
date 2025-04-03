const Product = require("../models/Product");
const path = require('path')



exports.addProduct = async (req, res) => {
  try {
    const { product_name, price } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const img = req.file.filename;
    const newProduct = new Product({ product_name, price, img });
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