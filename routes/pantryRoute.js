//pantryRoute.js will handle all backend routes and functionality for the '/pantry' route 

//Imports 
const express = require('express');
//import the prisma client
const { PrismaClient } = require('@prisma/client');

//create the prisma client for database access
const prisma = new PrismaClient();

//create an Express Router for the pantry route 
const pantryRouter = express.Router();

//GET ROUTE
pantryRouter.get('/', async (req, res, next) => {
  //query the database 
  const ingredients = await prisma.pantry.findMany();
  //render the template passing in the ingredients as a template variable
  res.render('pantry.html', { ingredients: ingredients });
});

//POST ROUTE
//middleware to encode the form submission so it is accessible in the post route 
//with 'req.body.<formName>'
pantryRouter.use(express.urlencoded({ extended: true })); //for form submissions
//main post route logic
pantryRouter.post('/add-ingredient', async (req, res, next) => {
  //try, catch
  try {
    //get the ingredient from the req.body (this is why we added the urlencoder middleware)
    const ingredient = req.body.ingredient;
    //check if the ingredient req was undefined
    if (!ingredient) {
      //throw an error 
      throw new Error("Ingredient required");
    }
    //otherwise, add the ingredient to the database 
    const newIngredient = await prisma.pantry.create({ data: {ingredient: ingredient}});
    //send a json response to the frontend
    res.json({ingredient: newIngredient.ingredient, id: newIngredient.id});
  } catch (err) { //catch any errors
    //utilize the next callback to handle errors
    next(err);
  }
});

//DELETE ROUTE 
pantryRouter.delete('/delete-ingredient/:id', async (req, res, next) => {
  //try, catch 
  try {
    //get the ingredient id from the request parameter
    const ingredientId = Number(req.params.id);
    //throw an error if it is undefined 
    if (!ingredientId) {
      throw new Error("Cant get that ingredient");
    }
    //delete the ingredient from the database by id 
    const deleteIngredient = await prisma.pantry.delete({
      where: {
        id: ingredientId, //id of the ingredient 
      },
    });
    //send a json response to the frontend 
    res.json({ingredient: deleteIngredient.ingredient, id: deleteIngredient.id});
  } catch (err) { //catch any errors
    //ultilize the next callback to handle errors
    next(err);
  }
});

//ERROR HANDLING MIDDLEWARE 
pantryRouter.use((err, req, res, next) => {
  //log the error
  console.log(err)
  //send a response and status
  res.status(500).send("Something  Broke");
});

//export the pantryRouter 
module.exports = pantryRouter
