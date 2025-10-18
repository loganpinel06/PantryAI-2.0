//supabase.js will create and export the supabase client

//import the createClient function from the supabase cli
import { createClient } from '@supabase/supabase-js';
//import dotenv and configure it
import dotenv from 'dotenv';
dotenv.config();

//create the supabase client
export const supabase = createClient(process.env.PROJECT_URL, process.env.ANON_KEY);



