const utilities = require("../utilities/");
const errorController = {};

// Normal route to trigger a 500 error intentionally
errorController.triggerError = (req, res, next) => {
  // This will throw an error that passes to the middleware
  throw new Error("This is a manually triggered 500 error.");
};

module.exports = errorController;