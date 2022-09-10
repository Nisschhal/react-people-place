/*
const mongoose = requrie("mongoose");

// SCHEMA/MODEL BLUEPRINT to work on
const Product = require("../models/product");

// URL TO DATABASE SERVER
const databaseUrl =
  "mongodb+srv://nischal:mernstack@cluster0.ulerbbg.mongodb.net/product_test?retryWrites=true&w=majority";

// connect to db server using mongoose
mongoose.connect(databaseUrl);

const createProduct = async (req, res) => {
  const { name, price } = req.body;
  const newProduct = {
    name: name,
    price: price,
  };
  const result = await newProduct.save(); // here model.save() does all the tast of opening db connection, creating collection by using model, Schema blueprint,inserting and closing.
};

const getProducts = async (req, res) => {
  const products = await Product.find().exec(); // ModelConstructor.find() use the model instace to use shcema and does all the heavy lifting that otherwise have to done with only mongodb, such as specifying opening the db, specifying collection name, and finding one, as mongodb .find() gives cursor to the database rows here mongoose .find() give an array of rows of Model/Schema collection.
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;


*/
