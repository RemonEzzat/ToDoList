//jshint esversion:6

// Varibles
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

// Method to use bodyParser
app.use(bodyParser.urlencoded({
  extended: true
}));
// Method to ues static file for any extar files
app.use(express.static("public"));
// Method to ues the Templets
app.set('view engine', 'ejs');
//connect DB
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true
});

const itemsSchema = {
  name: String
};

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
  name: "Welcom toDoList Man"
});
const item2 = new Item({
  name: "Hit + button to new item"
});

const item3 = new Item({
  name: "<--- Hit button to delete item"
});
const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

// Get function for route route (home route)
app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved");
        }
      });
      res.redirect("/");
    } else {
      // to Send var to EJS file
      res.render("list", {
        listTitle: 'Today',
        newListItems: foundItems
      });
    }

  });

  app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({
      name: customListName
    }, function(err, foundList) {
      if (!err) {
        if (!foundList) {
          //Creat anew list
          const list = new List({
            name: customListName,
            items: defaultItems
          });
          list.save();
          res.redirect("/" + customListName);
        } else {
          //Show an existing list
          res.render("list", {
            listTitle: foundList.name,
            newListItems: foundList.items
          });
        }
      }
    });
  });


});
// To post item in the html body
app.post("/", function(req, res) {
  const itemName = req.body.newItems;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (!err) {
        console.log("Remove Successfully");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id: checkedItemId}}},function (err, foundList) {
      if (!err) {
        res.redirect("/"+listName);
      }
    });
  }

});


app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
