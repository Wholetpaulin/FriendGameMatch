// Routes
// =============================================================
var tools = require('./tools');
var app = require('express').Router();
var path = require("path");
var bodyParser = require("body-parser");

// Sets up the Express app to handle data parsing
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "view.html"));
});

app.get("/survey", function(req, res) {
  res.sendFile(path.join(__dirname, "add.html"));
});

// Create comman matching games List - takes in JSON input
app.post("/post", function(req, res) {

  const input = req.body.input;
  console.log(`input is: ${JSON.stringify(input)}`);
  console.log(`input len is: ${input.length}`);

  tools.buildSimilarList(input) 
    .then((messyArr) => {
        return tools.digOut(messyArr); // clean up the messy response from steam... DIG OUT what we want!
    })
    .then((resultArr) => {
        return tools.compare(resultArr); // find the common elements in each array
    })
    .then((output) =>{
      console.log(output);
      res.json(output);
    }); // log out what was resolved by the promise
 
});

module.exports = app;
