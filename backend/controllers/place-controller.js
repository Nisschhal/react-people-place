// module to work with mongodb
const mongoose = require("mongoose");
// module to create unique random ids
const uuid = require("uuid").v4;
const User = require("../models/user-model");

// check the validation results
const { validationResult } = require("express-validator");

// error handling local build module
const HttpError = require("../models/http-error");
// const router = require("../routes/place-routes");
// const { route } = require("../routes/place-routes");

// MODELS
const Place = require("../models/place-model");

// DUMMY_DATA
// let PLACES = [
//   {
//     id: "p1",
//     title: "Empire State Building",
//     description: "One of the most famous sky scrapers in the world",
//     imageUrl:
//       "https://images.unsplash.com/photo-1617688319108-cb3bdc88f587?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80",
//     address: "20 W 34th St, New York, NY 10001, United States of America",
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584,
//     },
//     creator: "u1",
//   },
//   {
//     id: "p2",
//     title: "11 Empire State Building",
//     description: "One of the most famous sky scrapers in the world",
//     imageUrl:
//       "https://images.unsplash.com/photo-1617688319108-cb3bdc88f587?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80",
//     address: "20 W 34th St, New York, NY 10001, United States of America",
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584,
//     },
//     creator: "u2",
//   },
//   {
//     id: "p3",
//     title: "UK State Building",
//     description: "One of the most famous sky scrapers in the world",
//     imageUrl:
//       "https://images.unsplash.com/photo-1617688319108-cb3bdc88f587?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80",
//     address: "20 W 34th St, New York, NY 10001, United States of America",
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584,
//     },
//     creator: "u1",
//   },
// ];

//--------------- CREATE A NEW PLACE
const createPlace = async (req, res, next) => {
  // check the req object from the check middleware
  // if the validation is false then req object gives error and its message

  const error = validationResult(req);
  if (!error.isEmpty())
    // if error is not empty and hase some message then throw error
    return next(
      new HttpError("Enter a valid data in object to create a new place!"),
      401
    );

  // get the required content from req.body
  // if (!req.body)
  //   return next(new HttpError("No a valid object to create new Place!"), 401);

  // console.log(req.body);
  const { title, description, imageUrl, address, location, creator } = req.body;

  // check if the required fields are valid
  // if (!(title && description && imageUrl && address && location && creator))
  //   return next(new HttpError("No a valid object to create new Place!"), 401);

  // const newPlace = {
  //   id: uuid(),
  //   title,
  //   description,
  //   imageUrl,
  //   address,
  //   location,
  //   creator,
  // };

  const newPlace = new Place({
    title,
    description,
    imageUrl,
    address,
    location,
    creator,
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    return next(new HttpError("Place creation failed, please try again", 500));
  }

  if (!user) {
    return next(new HttpError("Creator not available in database", 404));
  }

  console.log(user);
  console.log(newPlace);
  // save by mongoose by doing all mongodb default queries and works

  // create a session for adding User ref into Place and place ref to User

  // let result;
  try {
    const sess = await mongoose.startSession(); // session start

    sess.startTransaction(); // start transactions
    await newPlace.save({ session: sess });
    user.places.push(newPlace);
    await user.save({ session: sess });
    await sess.commitTransaction(); // close the session by commiting the transaction.
  } catch (err) {
    return next(new HttpError(err.message, 500));
  }

  // PLACES.push(newPlace);
  return res
    .status(201)
    .json({ message: "Place created Successfully!", data: newPlace });
};

// GET PLACE BY PLACE ID
const getPlaceById = async (req, res) => {
  const { pid: placeId } = req.params;

  // const identifiedPlace = PLACES.find((place) => place.id === placeId);

  let identifiedPlace;
  try {
    identifiedPlace = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      `couldn't find any places, please try again!!`,
      500
    );
    return next(error);
  }

  //
  if (!identifiedPlace) {
    // const error = new Error(`couldn't find any places with the given place id`);
    // error.code = 404;
    const error = new HttpError(
      `couldn't find any places with the given place id`,
      404
    );
    return next(error);
  }

  req.place = identifiedPlace;
  const response = {
    message: "working fine!!",
    data: identifiedPlace.toObject({ getters: true }),
  };
  res.json(response); // sending json data as response
};

// GET PLACE BY USER ID
const getPlacesByUserId = async (req, res, next) => {
  const { uid: userId } = req.params;

  // const identifiedPlaces = PLACES.filter((place) => place.creator === userId);
  /*
  // const identifiedPlaces = await Place.find({ _id: userId }).exec();
  let identifiedPlaces;
  try {
    identifiedPlaces = await Place.find({ creator: userId }).exec();
  } catch (err) {
    const error = new HttpError(
      `couldn't find any places, please try again!!`,
      500
    );
    return next(error);
  }

  if (!identifiedPlaces?.length) {
    // const error = new Error(`couldn't find any places with the given user id`);
    // error.code = 404;
    return next(
      new HttpError(`couldn't find any places with the given place id`, 404)
    );
  }

  const response = {
    message: "working fine!!",
    data: identifiedPlaces.map((place) => place.toObject({ getters: true })),
  }; 
  */
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError(
      `couldn't find any places, please try again!!`,
      500
    );
    return next(error);
  }
  console.log(userWithPlaces);

  if (!userWithPlaces.places?.length) {
    // const error = new Error(`couldn't find any places with the given user id`);
    // error.code = 404;
    return next(
      new HttpError(`couldn't find any places with the given place id`, 404)
    );
  }

  const response = {
    message: "working fine!!",
    data: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  };
  res.send(response); // sending json data as response
};

// UPDATE PLACE BY ITS ID
const updatePlaceById = async (req, res, next) => {
  const { pid: placeId } = req.params;

  const { title, description } = req.body;

  // const identifiedPlace = { ...PLACES.find((place) => place.id === placeId) }; // making sure it doesn't give the memory location of real object rather we want to work on copy and then save it to needed memory location

  let identifiedPlace;
  try {
    identifiedPlace = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      `couldn't find any places, please try again!!`,
      500
    );
    return next(error);
  }

  if (!identifiedPlace) {
    return next(
      new HttpError(`couldn't find any places with the given place id`, 404)
    );
  }

  // finding the place index to update it in array
  // const placeIndex = PLACES.findIndex((place) => place.id === placeId);

  // updating the required fields
  identifiedPlace.title = title;
  identifiedPlace.description = description;

  identifiedPlace.save(); // again mongoose take cares of saving the updated fields above

  // updating the updated object in array
  // PLACES[placeIndex] = identifiedPlace;

  // RESPONSE
  return res.json({
    message: "Place updated successfully!!",
    data: identifiedPlace.toObject({ getters: true }),
  });
};

// DELETE PLACE BY ID
const deletePlaceById = async (req, res, next) => {
  // get the id
  const { pid: placeId } = req.params;
  // get the place by id
  // const identifiedPlace = PLACES.find((place) => place.id === placeId);
  let identifiedPlace;
  try {
    identifiedPlace = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      `couldn't find any places, please try again!!`,
      500
    );
    return next(error);
  }

  if (!identifiedPlace) {
    return next(
      new HttpError(`couldn't find any places with the given place id`, 404)
    );
  }

  let user;

  try {
    user = await User.findById(identifiedPlace.creator);
  } catch (err) {
    return next(
      new HttpError("Place creator fetched failed, please try again", 500)
    );
  }

  if (!user) {
    return next(new HttpError("Creator not available in database", 404));
  }

  // delete the relation and data
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // do work
    await identifiedPlace.remove({ session: sess });
    // pull/pop out the identified ref from places array
    user.places.pull(identifiedPlace);
    user.save();
    await sess.commitTransaction();

    // commit transaction()
  } catch (err) {
    return next(new HttpError(`Something went wrong, Please try again`, 500));
  }

  try {
    identifiedPlace.remove(); // mongoose remove takes care of all mongodb remove queries
  } catch (err) {
    return next(
      new HttpError(`couldn't delete place with the given place id`, 401)
    );
  }
  /*
  // get the place by id
  const identifiedPlace = PLACES.find((place) => place.id === placeId);

  if (!identifiedPlace)
    return new HttpError(`Couldn't find the place of give id`, 404);

  // get the place index by id
  const placeIndex = PLACES.findIndex((place) => place.id === placeId);

  // delete the place using id and splice method
  PLACES.splice(placeIndex, 1);

  */

  // FILTER ALL THE PALCE OF OTHER THAN GIVEN ID AND REPLACE IT INTO OLD ARRAY AS FILTER GIVE NEW ARRAY

  // PLACES = PLACES.filter((place) => place.id !== placeId);

  // send the response
  // console.log(PLACES);
  res.json({ message: "Place Deleted Successfully!!" });
};

exports.getPlaceByID = getPlaceById;
exports.getPlacesByUserID = getPlacesByUserId;
exports.postPlace = createPlace;
exports.patchPlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
