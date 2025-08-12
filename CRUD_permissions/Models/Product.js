const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,      
      required: true,   
      trim: true         
    },
    price: {
      type: Number,
      required: true     
    },
    category: {
      type: String,
      required: true     
    },
    stock: {
      type: Number,
      required: true   
    },
    description: {
      type: String
    },
    images: {
      type: [String],
      default: []
    },
    documents: {
      type: [String],
      default: []
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
