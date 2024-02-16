// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/");
const validate = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildCarDetailPageById));

router.get("/management", utilities.checkEditRights, invController.buildManagement);
  
router.get("/addClassification", utilities.checkEditRights, invController.buildAddClassification);

router.post("/addClassification", utilities.checkEditRights,  utilities.handleErrors(invController.postClassification));

router.get("/addInventory", utilities.checkEditRights, invController.buildAddInventory);

router.get("/edit/:inv_id", utilities.checkEditRights, utilities.handleErrors(invController.buildEdit));

router.post("/edit", validate.inventoryRules(), validate.checkUpdateData , utilities.checkEditRights, utilities.handleErrors(invController.postEditInventory));

router.get("/delete/:inv_id", utilities.checkEditRights, utilities.handleErrors(invController.buildDeletion));

router.post("/delete", utilities.checkEditRights, utilities.handleErrors(invController.postDeletion));

router.post("/addInventory", utilities.checkEditRights, validate.inventoryRules(), validate.checkInvData,  utilities.handleErrors(invController.postInventory));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

module.exports = router;