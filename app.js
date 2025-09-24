//app.js will run the main express application

//Import Modules
const express = require('express');

//create the app
const app = express();

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
