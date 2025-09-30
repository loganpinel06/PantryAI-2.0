//app.js will run the main express application

//Import Modules
import express from 'express';
import nunjucks from 'nunjucks';
import path from 'path';
import { fileURLToPath } from 'url';
//Import Express Routers 
import pantryRouter from './routes/pantryRoute.js';

//remake __dirname for ES6 syntax
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//create the app
const app = express();

//serve static files from the 'static' directory
//these files will be used for frontend functionality
app.use('/static', express.static(path.join(__dirname, 'static')));

//configure nunjucks templating 
nunjucks.configure('templates', {
  autoescape: true,
  express: app,
});

//mount the pantryRouter to the app
app.use('/pantry', pantryRouter);

//define the apps port
const port = 3000;

//start the server by listening to the port
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
