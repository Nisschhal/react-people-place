const uuid = require("uuid").v4;
const { validationResult } = require("express-validator");

// USER MODELS
const User = require("../models/user-model");
const HttpError = require("../models/http-error");

const USERS = [
  {
    fullName: "nischal puri",
    address: "ktm",
    email: "mrnischalpuri@gmail.com",
    password: "nisal@123",
  },
];

// SIGN UP USERS
const signup = async (req, res, next) => {
  const { fullName, email, password, image } = req.body;
  console.log(req.body);

  const error = validationResult(req);

  if (!error.isEmpty())
    return next(new HttpError(`Please enter a valid User Details!!!`, 402));

  //   if (!(fullName && email && address && password))
  //     return next(new HttpError(`Please enter a valid User Details!!!`, 402));

  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError(`Sign Up! faild, please try again!!!`, 402));
  }

  if (identifiedUser)
    return next(
      new HttpError(
        `User with email address already exists, please login!!`,
        404
      )
    );

  const newUser = new User({
    fullName,
    email,
    password,
    image,
    places: [],
  });
  console.log(`created=---------${newUser}`);

  if (!newUser)
    return next(
      new HttpError(`Please Provide Valid user Details and try again!!`, 500)
    );

  // USERS.push(newUser);

  // res.status(201).json({
  //   message: "User registered Successfully!!",
  //   registeredUser: newUser,
  // });

  let result;
  try {
    result = await newUser.save();
  } catch (err) {
    return next(
      new HttpError(`Couldn't create new User, please try again`, 500)
    );
  }

  // PLACES.push(newPlace);
  return res
    .status(201)
    .json({ message: "User created Successfully!", data: result });
};

// GET ALL USERS
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); // exclude password from data and get everything
  } catch (err) {
    return next(new HttpError(`user fetched failed, please try again!!!`, 500));
  }
  users = users.map((user) => user.toObject({ getters: true }));
  res.json(users);
};

// LOGIN USERS
const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);

  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError(`Login in failed, please try again!!!`, 500));
  }

  if (!identifiedUser || identifiedUser.password != password)
    return next(new HttpError(`Either Email or Password is wrong!!`, 404));

  res.status(200).json({ message: "Login Successfull!!" });
};

exports.getUsers = getUsers;
exports.loginUser = login;
exports.signUpUser = signup;
