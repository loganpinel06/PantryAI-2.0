//pantryController.js will handle all backend logic for the pantry routes 

//Imports 
//Prisma Client 
import { prisma } from '../app.js';
//import the generate_recipe function from the services/gemini.js file 
import generate_recipe from '../services/gemini.js';
//import the supabase client 
import { supabase } from '../services/supabase.js';

//handle backend logic for the GET request 
//this will get ALL ingredients from the database 
export const getIngredients = async (req, res, next) => {
  //try, catch 
  try {
    //get the user and token from the req object 
    const userId = req.user.id;
    //query the database by the userId 
    const ingredients = await prisma.pantry.findMany({
      where: { userId: userId }
    });
    //render the pantry template passing in the ingredients as a template variable
    res.render('pantry.html', { ingredients: ingredients });
  } catch (err) { //handle any errors
    next(err);
  }
};

//handle backend logic for the POST request
export const addIngredient = async (req, res, next) => {
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
    const newIngredient = await prisma.pantry.create({ 
      data: {
        ingredient: ingredient, //add the ingredient
        userId: req.user.id, //make sure the ingredient is added to the current user
      }
    });
    //send a json response to the frontend
    res.json({ingredient: newIngredient.ingredient, id: newIngredient.id});
  } catch (err) { //catch any errors
    //utilize the next callback to handle errors
    next(err);
  }
};

//handle backend logic for the DELETE request 
export const deleteIngredient = async (req, res, next) => {
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
        id_userId: { //compounded model-level attribute
          id: ingredientId, //id of the ingredient
          userId: req.user.id, //make sure the correct user is queried
        }
      },
    });
    //send a json response to the frontend 
    res.json({ingredient: deleteIngredient.ingredient, id: deleteIngredient.id});
  } catch (err) { //catch any errors
    //ultilize the next callback to handle errors
    next(err);
  }
};

//GEMINI API ROUTES 
//backend logic for generating a recipe with gemini api 
export const generateRecipes = async (req, res, next) => {
  //try, catch block
  try {
    //query the pantry model to get all pantry items
    const pantryItems = await prisma.pantry.findMany();
    //get the meal type from the req param 
    const mealType = req.body.meal_types;
    //create a list of ingredients from the pantryItems 
    const ingredientList = pantryItems.map(item => item.ingredient);
    //use the gemini api to generate recipes in JSON 
    const recipes = await generate_recipe(ingredientList, mealType);
    //send a json response to the frontend with the recipes as data 
    res.json(recipes);
  } catch (err) { //catch any errors
    next(err);
  }
};

