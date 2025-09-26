//pantryController.js will handle all backend logic for the pantry routes 

//Imports 
//Prisma Client 
const { PrismaClient } = require('@prisma/client');

//create the prisma client for database access
const prisma = new PrismaClient();

//handle backend logic for the GET request 
//this will get ALL ingredients from the database 
exports.getIngredients = async (req, res, next) => {
  //try, catch 
  try {
    //query the database 
    const ingredients = await prisma.pantry.findMany();
    //render the pantry template passing in the ingredients as a template variable
    res.render('pantry.html', { ingredients: ingredients });
  } catch (err) { //handle any errors
    next(err);
  }
};

//handle backend logic for the POST request
exports.addIngredient = async (req, res, next) => {
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
};

//handle backend logic for the DELETE request 
exports.deleteIngredient = async (req, res, next) => {
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
};

