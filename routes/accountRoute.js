// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")
const updateValidate = require("../utilities/account-update-validation")

// Route to build account management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManage),
)

// Route to build account login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount),
)

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount),
)

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin),
)

// Process account info update
router.post(
  "/update",
  utilities.checkLogin,
  updateValidate.accountUpdateRules(),
  updateValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount),
)

// Process password update
router.post(
  "/update-password",
  utilities.checkLogin,
  updateValidate.passwordRules(),
  updateValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword),
)

module.exports = router
