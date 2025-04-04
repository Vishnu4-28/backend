const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    price: { type: String, required: true },  
    img: { type: String },
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true, 
    //   },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
