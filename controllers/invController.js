const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
try {
  invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}
}
catch(error) {
  console.error(error);
  res.status(500).render("errors/error", {
    title: 'Error 500 Server Error',
    message: 'Internal Server Error'
  });
}

invCont.buildCarDetailPageById = async function (req, res, next) {
  try {
    const inventoryId = req.params.inventoryId
    const data = await invModel.getInventoryById(inventoryId)
    const grid = await utilities.buildDetaiilsGrid(data)
    let nav = await utilities.getNav()
    const vehicleName = `${data.inv_make} ${data.inv_model}`;
    res.render("./inventory/carDetails", {
      title: vehicleName + " details",
      nav,
      grid,
    })
  }
  catch(error) {
    console.error(error);
    res.status(500).render("errors/error", {
      title: 'Error 500 Server Error',
      message: 'Internal Server Error'
    });
  }
  
}

module.exports = invCont