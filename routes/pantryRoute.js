//pantryRoute.js will handle all backend routes for the '/pantry' route 

//Imports 
const express = require('express');
//import the pantry controllers 
const pantryController = require('../controllers/pantryController.js');

//create an Express Router for the pantry route 
const pantryRouter = express.Router();

//ROUTES
//GET ROUTE
pantryRouter.get('/', pantryController.getIngredients);
//POST ROUTE
//middleware to encode the form submission so it is accessible in the post route 
//with 'req.body.<formName>'
pantryRouter.use(express.urlencoded({ extended: true })); //for form submissions
pantryRouter.post('/add-ingredient', pantryController.addIngredient);
//DELETE ROUTE 
pantryRouter.delete('/delete-ingredient/:id', pantryController.deleteIngredient);

//ERROR HANDLING MIDDLEWARE 
//(can move this to a global file later if more middlewares get used)
pantryRouter.use((err, req, res, next) => {
  //log the error
  console.log(err)
  //send a response and status
  res.status(500).send("Something  Broke");
});

//export the pantryRouter 
module.exports = pantryRouter
