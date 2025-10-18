//pantryRoute.js will handle all backend routes for the '/pantry' route 

//Imports 
import express from 'express';
//import the pantry controllers 
import { getIngredients, addIngredient, deleteIngredient, generateRecipes } from '../controllers/pantryController.js';
//import the requireAuth middleware 
import { requireAuth } from '../middleware/requireAuth.js';

//create an Express Router for the pantry route 
const pantryRouter = express.Router();

//mount requireAuth middleware to the pantry routes 
pantryRouter.use(requireAuth);

//ROUTES

//GET ROUTE
pantryRouter.get('/', getIngredients);

//middleware to encode the form submission so it is accessible in the post route 
//with 'req.body.<formName>'
pantryRouter.use(express.urlencoded({ extended: true })); //for form submissions
//POST ROUTE
pantryRouter.post('/add-ingredient', addIngredient);

//DELETE ROUTE 
pantryRouter.delete('/delete-ingredient/:id', deleteIngredient);

//GENERATE RECIPE ROUTE
pantryRouter.post('/generate-recipes', generateRecipes);

//ERROR HANDLING MIDDLEWARE 
//(can move this to a global file later if more middlewares get used)
pantryRouter.use((err, req, res, next) => {
  //log the error
  console.log(err)
  //send a response and status
  res.status(500).send("Something  Broke");
});

//export the pantryRouter 
//use default since the router is the main (only) thing being exported from this file
export default pantryRouter;
