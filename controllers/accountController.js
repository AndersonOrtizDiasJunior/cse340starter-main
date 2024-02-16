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
  let tools = await utilities.getTools(res.locals)
  res.render("./account/login", {
    title: "Login",
    nav,
    tools,
    errors: null,
  })
}

/* ****************************************
*  Account Management View
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  let tools = await utilities.getTools(res.locals)
  let content = await utilities.accContent(res.locals)
  res.render("./account/management", {
    title: "Account Management",
    nav,
    tools,
    content,
    errors: null,
  })
}

/* ****************************************
*  Account Edit View
* *************************************** */
async function buildEdit(req, res, next) {
  let nav = await utilities.getNav()
  let tools = await utilities.getTools(res.locals)
  let info = await accountModel.getAccountByID(res.locals.accountData.account_id)
  res.render("./account/update", {
    title: "Account Update",
    nav,
    tools,
    errors: null,
    account_id: info.account_id,
    account_firstname: info.account_firstname,
    account_lastname: info.account_lastname,
    account_email: info.account_email,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  let tools = await utilities.getTools(res.locals)
  res.render("account/register", {
    title: "Register",
    nav,
    tools,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  let tools = await utilities.getTools(res.locals)
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      tools,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      tools,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      tools,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  let tools = await utilities.getTools(res.locals)
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    tools,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

/* ****************************************
 *  Process logout request
 * ************************************ */
 async function accountLogout(req, res) {
  try {
    // Clear the JWT cookie to logout the user
    res.clearCookie('jwt');
    return res.redirect("/"); // Redirect to the homepage or any other desired page after logout
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred during logout.");
  }
}

/* ****************************************
*  Process Account Edit
* *************************************** */
async function editAccount(req, res) {
  let nav = await utilities.getNav()
  let tools = await utilities.getTools(res.locals)
  let info = await accountModel.getAccountByID(res.locals.accountData.account_id)

  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const regResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id)

  if (regResult) {
    req.flash(
      "notice",
      `Your Account has been updated.`
    )
    let content = await utilities.accContent(res.locals)
    res.render("./account/management", {
      title: "Account Management",
      nav,
      tools,
      content,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the edit failed.")
    res.status(501).render("account/update", {
      title: "Account Update",
      nav,
      tools,
      errors: null,
      account_id: info.account_id,
      account_firstname: info.account_firstname,
      account_lastname: info.account_lastname,
      account_email: info.account_email,
    })
  }
}

/* ****************************************
*  Process Password Edit
* *************************************** */
async function editPass(req, res) {
  let nav = await utilities.getNav()
  let tools = await utilities.getTools(res.locals)
  const { account_password, account_id } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(501).render("account/update", {
        title: "Account Update",
        nav,
        tools,
        errors: null,
      })
    }

  const regResult = await accountModel.updatePassword(
    hashedPassword,
    account_id)
  
  if (regResult) {
    req.flash(
      "notice",
      `Your Password has been updated.`
    )
    let content = await utilities.accContent(res.locals)
    res.status(201).render("account/management", {
      title: "Account Management",
      nav,
      tools,
      content,
      errors: null,
    })
  } else {
    let info = await accountModel.getAccountByID(res.locals.accountData.account_id)
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/update", {
      title: "Account Update",
      nav,
      tools,
      errors: null,
      account_id: info.account_id,
      account_firstname: info.account_firstname,
      account_lastname: info.account_lastname,
      account_email: info.account_email,
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccount, buildEdit, editAccount, editPass, accountLogout }