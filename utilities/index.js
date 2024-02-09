const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getNotEmptyClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.getClassificationSelects = async function (id = 0, notEmpty = false , req, res, next) {
  let data
  console.log(notEmpty)
  if (notEmpty) {
    data = await invModel.getNotEmptyClassifications()
  } else {
    data = await invModel.getClassifications()
  }
  

  let options = ""
  data.rows.forEach((row) => {
    console.log('id is:' + id + (row.classification_id == id ? "equal" : "different"))
    options += "<option"
    if (row.classification_id == id) {
      options += ' selected'
    }
    options +=
      ' value=' +
      row.classification_id +
      '>' +
      row.classification_name +
      '</option>'
  })
  return options
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid += '<div class="namePrice">'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildDetaiilsGrid = async function(data){
  let grid
  if(data != null){
    grid = '<div id="carDetails">'
      grid += `<img src="${data.inv_image}"/>`
      grid += '<div id="carDescription">'
        grid += `<h1>${data.inv_make} ${data.inv_model}`
        grid += ` $${new Intl.NumberFormat('en-US').format(data.inv_price)}</h1>`
        grid += `<p>${data.inv_description}</p>`
        grid += `<ul>`
          grid += `<li><b>Fabricant:</b> ${data.inv_make}</li>`
          grid += `<li><b>Model:</b> ${data.inv_model}</li>`
          grid += `<li><b>Year:</b> ${data.inv_year}</li>`
          grid += `<li><b>Color:</b> ${data.inv_color}</li>`
          grid += `<li><b>Miles:</b> ${data.inv_miles}</li>`
        grid += `</ul>`
      grid += '</div>'
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }
 
module.exports = Util