const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/*  **********************************
 *  Account Update Data Validation Rules
 * ********************************* */
validate.accountUpdateRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    // valid email is required and cannot already exist
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const emailExists = await accountModel.getAccountByEmail(account_email)

        // allow same email if it belongs to the same account
        if (emailExists && emailExists.account_id != req.body.account_id) {
          throw new Error("Email exists. Please use a different email address.")
        }
      }),
  ]
}

/* ******************************
 * Check account update data and return errors or continue
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body

  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    return res.render("account/update-account", {
      errors,
      title: "Update Account",
      nav,
      accountData: {
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      },
    })
  }

  next()
}

/*  **********************************
 *  Password Update Validation Rules
 * ********************************* */
validate.passwordRules = () => {
  return [
    // password is required and must meet strength rules
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check password update data and return errors or continue
 * ***************************** */
validate.checkPasswordData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body

  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    const accountData = await accountModel.getAccountById(account_id)

    return res.render("account/update-account", {
      errors,
      title: "Update Account",
      nav,
      accountData,
    })
  }

  next()
}

module.exports = validate
