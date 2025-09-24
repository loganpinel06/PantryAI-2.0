//app.js will run the main express application

//Import Modules
const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');

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

//create a basic get route for testing
app.get('/', (req, res, next) => {
  res.send("Hello World");
});

//define the apps port
const port = 3000;

//start the server by listening to the port
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
