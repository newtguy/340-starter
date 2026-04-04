const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")

const validate = {}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a valid make."),

    body("inv_model")
      .trim()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a valid model."),

    body("inv_year")
      .notEmpty()
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Please provide a valid year."),

    body("inv_description")
      .trim()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("Please provide a description (at least 10 characters)."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Please provide an image path."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Please provide a thumbnail path."),

    body("inv_price")
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price."),

    body("inv_miles")
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Please provide valid mileage."),

    body("inv_color").trim().notEmpty().withMessage("Please provide a color."),

    body("classification_id")
      .notEmpty()
      .isInt()
      .withMessage("Please select a classification."),
  ]
}

/* ******************************
 * Check data and return errors or continue to inv
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(
      req.body.classification_id,
    )

    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors,
      classificationList,
      ...req.body,
    })
  }
  next()
}

module.exports = validate
