//authController.js will handle all backend logic for authentication routes such as login, register, and logout
//authentication will be handled using the supabase client library as the primary database is hosted on supabase

//Imports
//prisma client 
import { prisma } from '../app.js';
//import supabase client 
import { createClient } from '@supabase/supabase-js';
//import dotenv and configure it
import dotenv from 'dotenv';
dotenv.config();

//create the supabase client
const supabase = createClient(process.env.PROJECT_URL, process.env.ANON_KEY);

//handle logic for GET request on the login route (landing page "/")
//simply render a template 
export const renderLogin = async (req, res, next) => {
  //try, catch
  try {
    //render the login template 
    res.render('login.html');
  } catch (err) {
    next(err);
  }
}

//handle logic for GET request on the /register route 
//this will simply render the template 
export const renderRegister = async (req, res, next) => {
  //try, catch
  try {
    //render the html template
    res.render('register.html');
  } catch (err) {
    next(err);
  }
};

//function to handle registering a new user
//const registerUser = async (req, res, next) => {

//};
