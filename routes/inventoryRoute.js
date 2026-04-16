// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities") // index.js file grabbed by default
const classValidate = require("../utilities/classification-validation")
const invValidate = require("../utilities/inventory-validation")
const recentController = require("../controllers/recentController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to build vehicle detail view (add to recently viewed)
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(recentController.recordView),
  invController.buildVehicleDetailView,
)

// Route to build management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagement),
)

// Route to build Add Classification
router.get(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification),
)

// Route to build Add Inventory
router.get(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory),
)

// Route to build Get Inventory
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON),
)

// Route to build Edit Inventory
router.get(
  "/edit/:inventory_id",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildEditInventory),
)

// Route to build Delete inventory
router.get(
  "/delete/:inventory_id",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteConfirmation),
)

// Process addClassification data
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  classValidate.classificationRules(),
  classValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification),
)

// Process add inventory data
router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryRules(), // server-side validation rules
  invValidate.checkInventoryData, // validation error check
  utilities.handleErrors(invController.addInventory), // controller function
)

// Process update inventory data
router.post(
  "/update/",
  invValidate.inventoryRules(),
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.updateInventory),
)

// Process delete inventory
router.post(
  "/delete/",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventory),
)

module.exports = router
