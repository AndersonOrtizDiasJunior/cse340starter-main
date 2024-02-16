const utilities = require("../utilities")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  let tools = await utilities.getTools(res.locals)
  req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav, tools})
}

module.exports = baseController