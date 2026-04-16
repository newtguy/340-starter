const recentModel = require("../models/recent-model")
const utilities = require("../utilities")

async function recordView(req, res, next) {
  try {
    const inv_id = req.params.inv_id

    if (res.locals.accountData) {
      const account_id = res.locals.accountData.account_id
      await recentModel.addRecentView(account_id, inv_id)
    }

    next()
  } catch (error) {
    next(error)
  }
}

async function buildRecentView(req, res) {
  if (!res.locals.accountData) {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }

  let nav = await utilities.getNav()

  const account_id = res.locals.accountData.account_id

  const data = await recentModel.getRecentByAccountId(account_id)

  const grid = await utilities.buildRecentGrid(data)

  res.render("account/recent", {
    title: "Recently Viewed Vehicles",
    nav,
    grid,
    errors: null,
  })
}

module.exports = {
  recordView,
  buildRecentView,
}
