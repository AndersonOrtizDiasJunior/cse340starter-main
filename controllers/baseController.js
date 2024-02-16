const utilities = require("../utilities")
const invModel = require("../models/inventory-model")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  let tools = await utilities.getTools(res.locals)
  let highlight = await invModel.getHighlightCar()
  req.flash("notice", "This is a flash message.")
  res.render("index", 
  {
    title: "Home", 
    nav, 
    tools,
    name: `${highlight.inv_make} ${highlight.inv_model}`,
    image: highlight.inv_image,
    description: highlight.inv_description,
    url: `/inv/detail/${highlight.inv_id}`
  })
}

module.exports = baseController