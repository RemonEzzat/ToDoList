//jshint esversion:6

// Varibles
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItem = [];
// Method to use bodyParser
app.use(bodyParser.urlencoded({
  extended: true
}));
// Method to ues static file for any extar files
app.use(express.static("public"));
// Method to ues the Templets
app.set('view engine', 'ejs');
// Get function for route route (home route)
app.get("/", function(req, res) {

  const day = date.getDate();

  // to Send var to EJS file
  res.render("list", {
    listTitle: day,
    newListItems: items
  });

});
// To post item in the html body
app.post("/", function(req, res) {
  const item = req.body.newItems;
  if (req.body.list === "Work") {
    workItem.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});
app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItem
  });
});
app.get("/about", function(req, res) {
  res.render("about");

});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
