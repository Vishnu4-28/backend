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

// exports.updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     let { product_name, price } = req.body;

//     if (price) {
//       price = Number(price);
//       if (isNaN(price)) {
//         return res.status(400).json({ error: "Invalid price format" });
//       }
//     }

//     const updateData = { product_name, price };

//     if (req.file) {
//       updateData.img = req.file.filename;
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     res.status(200).json({ message: "Product updated successfully", product: updatedProduct });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



//  exports.updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { product_name, price } = req.body;


//     const product = await Product.findById(id);
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }


//     if (product_name) product.product_name = product_name;
//     if (price) product.price = price;
    

//     if (req.file) {
//       product.img = req.file.filename;
//     }

//     const updatedProduct = await product.save();
//     res.status(200).json({ message: "Product updated successfully", product: updatedProduct });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


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