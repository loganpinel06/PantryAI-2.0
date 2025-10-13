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

//function to handle registering a new user
const registerUser = async (req, res, next) => {

};
