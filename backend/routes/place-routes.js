const express = require("express");
const { check } = require("express-validator");

const placeControllers = require("../controllers/place-controller");

const router = express.Router(); // importing Router() method from express object.

// ROUTES TO ADD PLACE
router.post(
  "/",
  [
    check("title").not().isEmpty().withMessage("Enter a valid title"),
    check("description")
      .isLength({ min: 5 })
      .withMessage("Enter a description of atleast 5"),
    check("address").not().isEmpty().withMessage("Enter a valid address!"),
  ],
  placeControllers.postPlace
);

// ROUTE to get the place by its id
router.get("/:pid", placeControllers.getPlaceByID);

// ROUTES to get place by its creator id
router.get("/user/:uid", placeControllers.getPlacesByUserID);

// ROUTE TO UPDATE PLACE BY ID
router.patch("/:pid", placeControllers.patchPlaceById);

// ROUTE TO DELETE PLACE BY ID
router.delete("/:pid", placeControllers.deletePlaceById);
module.exports = router; // exporting the router to use on wherever this module is imported
