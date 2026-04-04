const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  let nav = await utilities.getNav()

  // If no vehicles exist, still show the page
  let grid = ""
  let className = "No Vehicles Found"

  if (data.length > 0) {
    grid = await utilities.buildClassificationGrid(data)
    className = data[0].classification_name
  }

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build single vehicle detail view
 * ************************** */
invCont.buildVehicleDetailView = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const vehicleData = await invModel.getVehicleById(inv_id)
    const nav = await utilities.getNav()
    console.log(vehicleData)

    if (!vehicleData) {
      return res.status(404).render("errors/error", {
        title: "Vehicle Not Found",
        message: "The requested vehicle does not exist.",
      })
    }

    const vehicleHTML = utilities.buildVehicleDetailHTML(vehicleData)

    res.render("inventory/vehicle-detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      vehicleHTML,
      nav,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build Add classification
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    message: req.flash("notice"),
    errors: null,
    classification_name: "",
  })
}

/* ***************************
 *  Add classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "Classification added successfully.")
    // rebuild Nav to show new classifications
    nav = await utilities.getNav()

    return res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      message: req.flash("notice"),
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the classification could not be added.")

    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: req.flash("notice"),
      classification_name,
      errors: null,
    })
  }
}

/* ***************************
 *  Build add inventory
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()

    // Pass empty strings for all form fields so EJS has something to reference
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      message: req.flash("notice"),
      errors: null,
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "/images/no-image.png",
      inv_thumbnail: "/images/no-image.png",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Add inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body

    const result = await invModel.addInventory({
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })

    if (result) {
      req.flash("notice", "Vehicle added successfully!")
      const nav = await utilities.getNav()
      return res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        message: req.flash("notice"),
        errors: null,
      })
    } else {
      throw new Error("Failed to add vehicle.")
    }
  } catch (error) {
    next(error)
  }
}

module.exports = invCont