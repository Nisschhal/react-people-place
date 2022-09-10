/*
// USING NODE AS TRADITIONAL WAY WITHOUT EXPRESS;

const http = require("http"); // importing web/http module for creating web server.

const server = http.createServer((req, res) => {
  console.log("INCOMING REQUEST");
  console.log(req.method, req.url);
  // REQUESTS
  if (req.method === "POST") {
    let body = ""; // traditional http server doesn't have body in req to handle data, rather data are streamed in chunks into the server
    req.on("end", () => {
      console.log(body);
      const username = body.split("=")[1]; // accessing the 2nd item in body array, that is passed real name
      res.end(
        "<h1>Got the POST request! with data, username: " + username + " </h1>"
      );
    }); // .on('end,()=>{}) tells what to do when req is completed
    req.on("data", (chunk) => {
      body += chunk; // adding streaming chunk data into body
    });
  }

  // RESPONSE
  else {
    res.setHeader("Content-Type", "text/html"); // tells browser to see response as text/plain and text/http to see html contents as html tags
    res.end(
      `<form method='POST' ><input type='text' name="username"><button type='submit'>Create User</button></form>`
    );
    // sending response using .end() as it specified req has completed and ended.
  }
}); // creating server using https object. it takes req and res for any requests.

server.listen(5000); // connecting server to 5000 port number. listen helps server keep going unless manually shutdown.
*/

/*
const express = require("express"); // importing express framework function under express variable.
const bodyParser = require("body-parser"); // for parsing request content into body

// local built modules

const app = express(); // passing express function object to app to work on.
// USING BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }));

// using routes module
app.use()



// REQUEST MIDDLEWARE
// app.use((req, res, next) => {
//   let body = "";
//   req.on("end", () => {
//     const username = body.split("=")[1];
//     if (username) req.body = { name: username };
//     console.log(username);
//     next(); // when requests is done go to the next response middleware
//   });
//   req.on("data", (chunk) => {
//     body += chunk;
//   });
// });

// RESPONSE MIDDLE
app.use((req, res, next) => {
  if (req.body) {
    return res.send(`<h1>${req.body.name}</h1>`);
  }
  res.send(
    `<form method='POST'> <input type="text" name="username"/> <button type="submit">Create Username</button></form>`
  );
}); // middleware to support server app. // middleware can be used by calling use();
//every requests and response are funneled through some kind of middleware and middleware is just a funtion, upon which a data, to work on
// next is a function which help pass to another middleware fucntion if there are any, otherwise next() can be ignored if working function is last function/middleware where response is sent

app.listen(5000, () => console.log("Server connected Successfully!!")); // using .listen() from app object. to listen port 5000 and create server loop
*/

const express = require("express"); // importing express framework function under express variable.
const bodyParser = require("body-parser"); // for parsing request content into body
const mongoose = require("mongoose");

// local built modules
const placesRoutes = require("./routes/place-routes");
const userRoutes = require("./routes/user-routes");

// database server
// const mongodb = require("./database/mongodb");
const databaseUrl =
  "mongodb+srv://nischal:mernstack@cluster0.ulerbbg.mongodb.net/mern_people_place?retryWrites=true&w=majority";

// custom error handler
const HttpError = require("./models/http-error");

const app = express(); // passing express function object to app to work on.

// USING BODY PARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// using routes module
app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);
// app.post("/api/products", placeCon.createProduct);
// app.use("/api/products", getAllProducts);

// middleware to handle any other invalid urls
app.use((req, res, next) => {
  const error = new HttpError("Please enter a valid url", 404);
  throw error;
});

// handling error middlware
app.use((error, req, res, next) => {
  if (res.headerSent) return next(error); // ignore error by callind next(error);
  // if headerSent is false then // 500 for internal server error
  return res
    .status(error.code || 500)
    .json({ message: error.message || "An unexpected error occured!!" });
});

// CONNECTION TO DB AND THEN TO SERVER

mongoose
  .connect(databaseUrl)
  .then(() => {
    app.listen(5000, () =>
      console.log("Database and Server connected Successfully!!")
    ); // using .listen() from app object. to listen port 5000 and create server loop
  })
  .then(() => {
    console.log("Everything is fine, final Check!!");
  })
  .catch((err) => {
    console.log("Error occur while connecto to database:" + err);
  });
