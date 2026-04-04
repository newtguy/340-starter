const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")

const validate = {}

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage(
        "Classification name must not contain spaces or special characters.",
      ),
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      classification_name: req.body.classification_name,
    })
  }
  next()
}

module.exports = validate
