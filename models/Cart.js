// const mongoose = require("mongoose");

// const cartSchema = new mongoose.Schema({
//     product_name: { type: String, required: true },
//     price: { type: String, required: true },  
//     img: { type: String },
//     count:{type: Number},
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//       },
// }, { timestamps: true });

// module.exports = mongoose.model("Cart", cartSchema);






const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String },
  count: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true ,
  },
  products: [productSchema],
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);
