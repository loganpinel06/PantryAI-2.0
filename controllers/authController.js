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
//import the prisma client from app.js
import { prisma } from '../app.js';

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
export const registerUser = async (req, res, next) => {
  //try, catch 
  try {
    //get the email, password, and confirmPassword from req.body 
    const {email, password, confirmPassword} = req.body;
    //conditionals to make sure data was actually provided
    if (!email) {
      throw new Error('Email required');
    } else if (!password) {
      throw new Error('Password required');
    } else if (!confirmPassword) {
      throw new Error('Please confirm your password');
    }

    //conditional to check if the password and confirmPassword dont match 
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    //create a new user in the supabase client 
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    //check if there was an error with supabase 
    if (error) {
      next(error);
    }
    //get the new users id to store in prisma for data connection 
    const userId = data.user.id;

  } catch (err) {
    next(err);
  }
};
