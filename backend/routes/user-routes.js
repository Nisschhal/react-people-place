const express = require("express");
const { check } = require("express-validator");

const userController = require("../controllers/user-controller");

const router = express.Router();

router.get("/", userController.getUsers);
router.post("/login", userController.loginUser);
router.post(
  "/signup",
  [check("fullName").not().isEmpty(), check("email").normalizeEmail()],
  userController.signUpUser
);

module.exports = router;
