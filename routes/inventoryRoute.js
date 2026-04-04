// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities") // index.js file grabbed by default
const classValidate = require("../utilities/classification-validation")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to build vehicle detail view
router.get("/detail/:inv_id", invController.buildVehicleDetailView)

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build Add Classification
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification),
)

// Route to build Add Inventory
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory),
)

// Process addClassification data
router.post(
  "/add-classification",
  classValidate.classificationRules(),
  classValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification),
)

// Process add inventory data
router.post(
  "/add-inventory",
  invValidate.inventoryRules(), // server-side validation rules
  invValidate.checkInventoryData, // validation error check
  utilities.handleErrors(invController.addInventory), // controller function
)

module.exports = router
