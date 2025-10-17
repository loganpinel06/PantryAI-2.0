//authRoute.js will handle creating all routes for login, registration, and logout

//imports 
import express from "express";
//import controller functions from '../controllers/authController.js'
import { renderLogin, renderRegister } from "../controllers/authController.js";

//create a router for authentication
const authRouter = express.Router();

//ROUTES 
//GET ROUTES (render templates) 
//login template 
authRouter.get('/', renderLogin);
//register template
authRouter.get('/register', renderRegister);

//export the authRouter 
export default authRouter;
