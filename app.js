// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const { getDate } = require("./date");
const date = require(__dirname + "/date.js");
const app = express();
const mongoose = require("mongoose");


app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

// connecting to mongodb using mongoose
mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });

// Schema
const taskSchema = new mongoose.Schema({
    item: String
});




// Model
const Task = mongoose.model("task", taskSchema);

const item1 = new Task({
    item: "Welcome to your to-do list"
});
const item2 = new Task({
    item: "Hit the + button to add an item"
});
const item3 = new Task({
    item: "<-- Hit to delete an item"
})

const defaultItems = [item1, item2, item3];



// Schema for custom lists

const listSchema = new mongoose.Schema({
    name: String,
    items: [taskSchema]
})

// Model for custom lists

const List = mongoose.model("list", listSchema);

// GET AND POST REQUESTS
app.get("/", function (req, res) {

    Task.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Task.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Saved");
                }
            });
            res.redirect("/");
        } else {
            res.render("lists", { listTitle: today, newTasks: foundItems });
        }

    });
    let today = date.getDate();

});

app.post("/", function (req, res) {
    const listName = req.body.button
    const itemName = req.body.newItem;
    let today = date.getDate();
    const item = new Task({
        item: itemName
    });
    if (listName === today) {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name:listName},function (err,foundList) {
            foundList.items.push(item)
            foundList.save();
        })
        res.redirect("/" + listName);
    }

});

app.post("/delete", function (req, res) {
    const checkedItemID = req.body.checked

    Task.findByIdAndDelete(checkedItemID, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/")
        }
    });

});

// Custom lists
app.get("/:customListName", function (req, res) {

    const customListName = req.params.customListName
    List.findOne({ name: customListName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                // create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                // show an extisting list

                res.render("lists", { listTitle: foundList.name, newTasks: foundList.items });
            }
        }
    })
});

app.listen(3000, function () {
    console.log("Server started at port 3000");
});



// items
// rsrrsrs
