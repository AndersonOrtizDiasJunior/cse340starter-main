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
  let tools = await utilities.getTools(res.locals)
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    tools,
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
    let tools = await utilities.getTools(res.locals)
    const vehicleName = `${data.inv_make} ${data.inv_model}`;
    res.render("./inventory/carDetails", {
      title: vehicleName + " details",
      nav,
      tools,
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

invCont.buildManagement  = async function (req, res, next) {
  let nav = await utilities.getNav()
  let tools = await utilities.getTools(res.locals)
  const classificationSelect = await utilities.getClassificationSelects(0, true)
  res.render("./inventory/management", {
    title: "Maneger Dashboard",
    nav,
    tools,
    classificationSelect,
    errors: null,
  })
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEdit = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let tools = await utilities.getTools(res.locals)
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.getClassificationSelects(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    tools,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.postEditInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let tools = await utilities.getTools(res.locals)
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationSelect = await utilities.getClassificationSelects(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    tools,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildDeletion = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let tools = await utilities.getTools(res.locals)
  const itemData = await invModel.getInventoryById(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    tools,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.postDeletion = async function (req, res, next) {
  let nav = await utilities.getNav()
  let tools = await utilities.getTools(res.locals)
  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
    const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/management")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    tools,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0]) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.buildAddClassification  = async function (req, res, next) {
  let nav = await utilities.getNav()
  let tools = await utilities.getTools(res.locals)
  res.render("./inventory/addClassification", {
    title: "Add Classification",
    nav,
    tools,
    errors: null,
  })
}

invCont.postClassification = async function (req, res) {
  let nav = await utilities.getNav()
  let tools = await utilities.getTools(res.locals)
  const classification_name = req.body.classification_name

  const regResult = await invModel.addClassification(classification_name)

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, the Classfifcartion ${classification_name} was added.`
    )
    res.status(201).render("inventory/addClassification", {
      title: "Add Classification",
      nav,
      tools,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, an error ocurred.")
    res.status(501).render("inv/addClassification", {
      title: "Add Classification",
      nav,
      tools,
      errors: null,
    })
  }
}

invCont.postInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let tools = await utilities.getTools(res.locals)
  let classificationList = await utilities.getClassificationSelects()
  const inv_make = req.body.inv_make 
  const inv_model = req.body.inv_model;
  const inv_year = req.body.inv_year;
  const inv_description = req.body.inv_description;
  const inv_image = req.body.inv_image;
  const inv_thumbnail = req.body.inv_thumbnail;
  const inv_price = parseFloat(req.body.inv_price);
  const inv_miles = parseInt(req.body.inv_miles);
  const inv_color = req.body.inv_color;
  const classification_id = parseInt(req.body.classification_id);
  const regResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,inv_price, inv_miles,inv_color, classification_id)

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, the Inventory ${inv_make + " " + inv_model} was added.`
    )
    res.status(201).render("inventory/addInventory", {
      title: "Add Inventory",
      nav,
      tools,
      classificationList,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, an error ocurred.")
    res.status(501).render("inv/addInventory", {
      title: "Add Inventory",
      nav,
      tools,
      classificationList,
      errors: null,
    })
  }
}

invCont.buildAddInventory  = async function (req, res, next) {
  let nav = await utilities.getNav()
  let tools = await utilities.getTools(res.locals)
  let classificationList = await utilities.getClassificationSelects()
  res.render("./inventory/addInventory", {
    title: "Add Inventory",
    nav,
    tools,
    classificationList,
    errors: null,
  })
}

module.exports = invCont