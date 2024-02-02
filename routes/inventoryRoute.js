// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/");
const validate = require('../utilities/account-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildCarDetailPageById));

router.get("/management", invController.buildManagement);

router.get("/addClassification", invController.buildAddClassification);

router.post("/addClassification",  utilities.handleErrors(invController.postClassification));

router.get("/addInventory", invController.buildAddInventory);

router.post("/addInventory", validate.inventoryRules(), validate.checkInvData,  utilities.handleErrors(invController.postInventory));

module.exports = router;