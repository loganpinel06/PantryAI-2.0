//pantryRoute.js will handle all backend routes and functionality for the '/pantry' route 

//Imports 
const express = require('express');
//import the prisma client
const { PrismaClient } = require('@prisma/client');

//create the prisma client for database access
const prisma = new PrismaClient();

//create an Express Router for the pantry route 
const pantryRouter = express.Router();

pantryRouter.get('/', async (req, res, next) => {
  //query the database 
  const ingredients = await prisma.pantry.findMany();
  //render the template passing in the ingredients as a template variable
  res.render('pantry.html', { ingredients: ingredients });
});

//export the pantryRouter 
module.exports = pantryRouter
