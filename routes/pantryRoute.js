//pantryRoute.js will handle all backend routes and functionality for the '/pantry' route 

//Imports 
const express = require('express');
//import the prisma client
const { PrismaClient } = require('@prisma/client');

//create the prisma client for database access
const prisma = new PrismaClient();

//create an Express Router for the pantry route 
const pantryRouter = express.Router();

pantryRouter.get('/', (req, res, next) => {
  res.send("Hello World");
});

//export the pantryRouter 
module.exports = pantryRouter
