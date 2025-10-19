//requireAuth.js will create a middleware function that will be used to protect 
//main application routes by checking if there is a valid access_token send in the apps cookies
//to require login for the main routes 
//the middleware will also attach a user and their token (if valid) so that protected routes 
//can have easy access to them for database querying purposes

//import supabase client from supabase.js
import { supabase } from '../services/supabase.js';

//create the requireAuth middleware function 
export const requireAuth = async (req, res, next) => {
  //try, catch 
  try {
    //get the access_token from the session cookies 
    const token = req.cookies.access_token;
    //check if the token doesnt exist
    if (!token) {
      //redirect to the login route
      //set a query parameter so that we can display a message on the frontend 
      return res.redirect("/?message=Please+log+in+to+continue");
    }
    //get the user from the supabase client 
    const { data, error } = await supabase.auth.getUser(token);
    //if there is an error getting the User (invalid session or user)
    //redirect to login route 
    if (error) {
      return res.redirect("/?message=Please+log+in+to+continue")
    }

    //attach the user and token to the request object
    req.user = data.user;
    req.token = token;

    //call next() if the user is valid to proceed to the route
    next();

  } catch (err) {
    console.log("requireAuth middleware error", err);
    res.redirect('/');
  }
};


//find a way to send a messsage to the frontend later
