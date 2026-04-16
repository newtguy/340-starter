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
    // console.log(vehicleData)

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
  const classificationSelect = await utilities.buildClassificationList()
  const flashMessages = req.flash("notice") || []

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    classificationSelect,
    message: flashMessages,
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

    // Insert the vehicle into the database
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
      // Vehicle added successfully
      const itemName = `${result.inv_make} ${result.inv_model}`
      req.flash("notice", `The ${itemName} was added successfully!`)
      // Redirect to the management page where the flash message will display
      return res.redirect("/inv/")
    } else {
      // Insert failed
      let nav = await utilities.getNav()
      const classificationList =
        await utilities.buildClassificationList(classification_id)
      req.flash("notice", "Sorry, the vehicle could not be added.")
      return res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        message: req.flash("notice"),
        errors: null,
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
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData =
    await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit item view
 * ************************** */
invCont.buildEditInventory = async (req, res, next) => {
  try {
    const inventory_id = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleById(inventory_id)
    const classificationSelect = await utilities.buildClassificationList(
      itemData.classification_id,
    )
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect =
      await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
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
  }
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteConfirmation = async function (req, res, next) {
  try {
    const inventory_id = parseInt(req.params.inventory_id)
    const flashMessages = req.flash("notice") || []
    let nav = await utilities.getNav()

    const itemData = await invModel.getVehicleById(inventory_id)

    if (!itemData) {
      return next({ status: 404, message: "Vehicle not found" })
    }

    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
      message: flashMessages,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)

    const deleteResult = await invModel.deleteInventory(inv_id)

    if (deleteResult) {
      req.flash("notice", "Vehicle successfully deleted.")
      return res.redirect("/inv/")
    } else {
      req.flash("notice", "Delete failed. Please try again.")

      // rebuild delete view for same item
      return res.redirect(`/inv/delete/${inv_id}`)
    }
  } catch (error) {
    next(error)
  }
}

module.exports = invCont