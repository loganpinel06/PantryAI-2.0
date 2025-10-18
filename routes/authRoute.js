//authRoute.js will handle creating all routes for login, registration, and logout

//imports 
import express from "express";
//import controller functions from '../controllers/authController.js'
import { renderLogin, renderRegister, registerUser, loginUser, logoutUser} from "../controllers/authController.js";

//create a router for authentication
const authRouter = express.Router();

//ROUTES 

//GET ROUTES (render templates) 
//login template 
authRouter.get('/', renderLogin);
//register template
authRouter.get('/register', renderRegister);
//logout a user 
authRouter.get('/logout', logoutUser);

//POST ROUTES 
//middleware to encode the form submission so it is accessible in the post route 
//with 'req.body.<formName>'
authRouter.use(express.urlencoded({ extended: true })); //for form submissions
//route to register a new user 
authRouter.post('/register/newUser', registerUser);
//route to login a user 
authRouter.post('/loginUser', loginUser);

//ERROR HANDLING MIDDLEWARE 
authRouter.use((err, req, res, next) => {
  //log the error
  console.log(err)
  //send a response and status
  res.status(500).send("Something  Broke");
});

//export the authRouter 
export default authRouter;
