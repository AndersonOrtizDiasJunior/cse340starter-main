const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

validate.inventoryRules = () => {
    return [
      // make is required and must be a string
      body("inv_make")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a make."), // on error this message is sent.
  
      // model is required and must be a string
      body("inv_model")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a model."), // on error this message is sent.
  
      // year is required and must be a 4-character string representing a valid year
      body("inv_year")
        .trim()
        .isLength({ min: 4, max: 4 })
        .withMessage("Please provide a valid 4-digit year."), // on error this message is sent.
  
      // description is required and must be a string
      body("inv_description")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a description."), // on error this message is sent.
  
      // thumbnail is required and must be a string
      body("inv_thumbnail")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a thumbnail."), // on error this message is sent.
  
      // price is required and must be a number
      body("inv_price")
        .trim()
        .isNumeric()
        .withMessage("Please provide a valid price."), // on error this message is sent.
  
      // miles is required and must be an integer
      body("inv_miles")
        .trim()
        .isInt({ min: 0 })
        .withMessage("Please provide valid miles."), // on error this message is sent.
  
      // color is required and must be a string
      body("inv_color")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a color."), // on error this message is sent.
  
      // classification_id is required and must be an integer
      body("classification_id")
        .trim()
        .isInt({ min: 1 })
        .withMessage("Please provide a valid classification ID."), // on error this message is sent.
    ];
  };

validate.checkInvData = async (req, res, next) => {
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
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let classificationList = await utilities.getClassificationSelects()
      res.render("inventory/addInventory", {
        errors,
        title: "Add Inventory",
        nav,
        classificationList,
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
      return
    }
    next()
  }

validate.checkUpdateData = async (req, res, next) => {
    const inv_id = parseInt(req.body.inv_id);
    const inv_make = req.body.inv_make;
    const inv_model = req.body.inv_model;
    const inv_year = req.body.inv_year;
    const inv_description = req.body.inv_description;
    const inv_image = req.body.inv_image;
    const inv_thumbnail = req.body.inv_thumbnail;
    const inv_price = parseFloat(req.body.inv_price);
    const inv_miles = parseInt(req.body.inv_miles);
    const inv_color = req.body.inv_color;
    const classification_id = parseInt(req.body.classification_id);
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const itemData = await invModel.getInventoryById(inv_id)
        const classificationSelect = await utilities.getClassificationSelects(itemData.classification_id)
        const itemName = `${itemData.inv_make} ${itemData.inv_model}`
        res.render("./inventory/edit-inventory", {
          title: "Edit " + itemName,
          nav,
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
      return
    }
    next()
  }
  
  module.exports = validate