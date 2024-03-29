// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accountController.js")
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accController.buildLogin));

router.get("/logout", utilities.handleErrors(accController.accountLogout));

router.get("/", utilities.checkLogin, utilities.handleErrors(accController.buildAccount));

router.get("/edit", utilities.checkLogin, utilities.handleErrors(accController.buildEdit));

router.post('/edit',regValidate.editRules(), 
regValidate.checkEditData, 
utilities.handleErrors(accController.editAccount));

router.post('/pass/edit',regValidate.editPassRules(), 
regValidate.checkEditData, 
utilities.handleErrors(accController.editPass));

router.get("/register", utilities.handleErrors(accController.buildRegister));

router.post('/register',regValidate.registationRules(), 
regValidate.checkResData, 
utilities.handleErrors(accController.registerAccount));

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accController.accountLogin)
)

module.exports = router;