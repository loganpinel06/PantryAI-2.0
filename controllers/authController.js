//authController.js will handle all backend logic for authentication routes such as login, register, and logout
//authentication will be handled using the supabase client library as the primary database is hosted on supabase

//Imports
//prisma client 
import { prisma } from '../app.js';
//import supabase client 
import { supabase } from '../services/supabase.js';

//handle logic for GET request on the login route (landing page "/")
//simply render a template 
export const renderLogin = async (req, res, next) => {
  //try, catch
  try {
    //get the query string (might not exist if the user hasn't trie to access a protected
    //route but this condition will be handled in the nunjucks template)
    const message = req.query.message;
    //render the login template and pass the message to nunjucks
    res.render('login.html', { message });
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
    //add the userId to the prisma Users model 
    await prisma.user.create({data: {userId: userId}});

    //redirect users to the login page 
    res.redirect('/');

  } catch (err) {
    next(err);
  }
};

//function to handle logging in a user 
export const loginUser = async (req, res, next) => {
  //try, catch 
  try {
    //get the email and password from the req.body 
    const {email, password} = req.body;
    //conditionals to make sure data was actually provided
    if (!email) {
      throw new Error('Email required');
    } else if (!password) {
      throw new Error('Password required');
    }

    //login the user with supabase client 
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    //check if there was an error 
    if (error) {
      next(error);
    }

    //send a cookie for the user 
    res.cookie("access_token", data.session.access_token, { httpOnly: true });

    //redirect to the pantry route 
    res.redirect('/pantry');

  } catch (err) {
    next(err);
  }
}

//function to handle logout 
export const logoutUser = async (req, res, next) => {
  //clear the cookie access_token 
  res.clearCookie("access_token");
  //redirect to the login page
  res.redirect("/");
};
