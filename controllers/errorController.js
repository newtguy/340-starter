const utilities = require("../utilities/");
const errorController = {};

// Normal route to trigger a 500 error intentionally
errorController.triggerError = (req, res, next) => {
  const err = new Error("This is a manually triggered 500 error.");
  err.status = 500;
  next(err);
};

module.exports = errorController;