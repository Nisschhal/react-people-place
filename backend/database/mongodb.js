/*
// IMPORTING MONGOCLIENT CLASS TO CREATE A NEW INSTANCE
const MongoClient = require("mongodb").MongoClient;

// URL TO DATABASE SERVER
const databaseUrl =
  "mongodb+srv://nischal:mernstack@cluster0.ulerbbg.mongodb.net/product_test?retryWrites=true&w=majority";

const createProduct = async (req, res) => {
  // asynchronous function
  const { name, price } = req.body;
  const newProduct = {
    name: name,
    price: price,
  };
  const client = new MongoClient(databaseUrl); // create the new connection to the database server by new Client instance
  try {
    await client.connect(); // connect to database , client instance, server
    const db = client.db(); // once the server connection is done create a database connection.
    const result = db.collection("products").insertOne(newProduct); //create, if doesn't exist, or add into existed collection a newProduct.
  } catch (er) {
    return res.json({
      message: "Couldn't established a connection to server!!",
    });
  }
  setTimeout(() => {
    client.close();
  }, 1500); // close the database server once the work in done.
  res.json(newProduct);
};

const getProducts = async (req, res) => {
  const client = new MongoClient(databaseUrl);

  let products;

  try {
    // connect to client
    await client.connect();

    // connect to db
    const db = client.db();

    // use the db to perform task
    products = db.collection("products").find().toArray();
  } catch (err) {
    return res.json({ message: "couldn't reterive data!" });
  }

  setTimeout(() => {
    client.close();
  }, 1500);
  res.json(products);
};
exports.getAllProducts = getProducts;
exports.createProduct = createProduct;

*/
