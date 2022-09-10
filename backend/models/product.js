const mongoose = require("mongoose");

// create a new schema constructor to create model blueprint
const productSchema = new mongoose.Schema({
  name: { type: String, required },
  price: { type: Number, required },
});

// export the schema to create new Product models into other imported files
module.exports = mongoose.Model("Product", productSchema);
