/* ****************************************
 *  Requirements
 * *************************************** */
const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    account_email: "",
    errors: null,
  })
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Deliver account management view
 * *************************************** */
async function buildManage(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account-management", {
    title: "Manage Account",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Deliver Update Account View
 * *************************************** */
async function buildUpdateAccount(req, res) {
  let nav = await utilities.getNav()

  const account_id = req.params.account_id
  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/update-account", {
    title: "Update Account Information",
    nav,
    accountData,
    errors: null,
  })
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration.",
    )
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`,
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      account_email,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 },
      )
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        })
      }
      return res.redirect("/account/")
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again.",
      )
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error("Access Forbidden")
  }
}

/* ****************************************
 *  Process logout request
 * *************************************** */
async function accountLogout(req, res) {
  try {
    res.clearCookie("jwt")
    return res.redirect("/")
  } catch (error) {
    throw new Error("Logout Error")
  }
}

/* ****************************************
 *  Process Update info request
 * *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()

  const { account_id, account_firstname, account_lastname, account_email } =
    req.body

  const result = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  )

  if (result) {
    const updatedAccount = await accountModel.getAccountById(account_id)

    req.flash("notice", "Account updated successfully")

    return res.render("account/account-management", {
      title: "Account Management",
      nav,
      accountData: {
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      },
      errors: null,
    })
  } else {
    req.flash("notice", "Account update failed")

    return res.redirect(`/account/update/${account_id}`)
  }
}

/* ****************************************
 *  Process Update-password request
 * *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav()

  const { account_id, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the new password.",
    )

    const accountData = await accountModel.getAccountById(account_id)

    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData,
      errors: null,
    })
  }

  const result = await accountModel.updatePassword(account_id, hashedPassword)

  if (result) {
    req.flash("notice", "Password updated successfully")
    return res.redirect("/account/")
  } else {
    req.flash("notice", "Password update failed")

    return res.render("account/update-account", {
      title: "Update Account Information",
      nav,
      accountData: {
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      },
      errors,
    })
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  buildManage,
  buildUpdateAccount,
  registerAccount,
  accountLogin,
  accountLogout,
  updateAccount,
  updatePassword,
}
