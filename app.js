// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const { getDate } = require("./date");
const date = require(__dirname + "/date.js");
const app = express();
const mongoose = require("mongoose");

var items=[]

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

// connecting to mongodb using mongoose
mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });

// creating the schema
const taskSchema = new mongoose.Schema({
    item: String
});

// creating the model
const Task = mongoose.model("task", taskSchema);

// items
const item1 = new Task({
    item:"Swimming"
});
const item2 = new Task({
    item:"fishing"
});
const item3 = new Task({
    item:"Trekking"
});

// db queries



app.get("/", function (req, res) {

    Task.find({},function (err,i) {
        res.render("lists", { listTitle: "Today", newTasks: i });
    })   
    // let today = date.getDate();
    

});

app.post("/", function (req, res) {

    let item = req.body.newItem;

    if (req.body.button === "Work List") {
        workitems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }

});

app.get("/work", function (req, res) {
    res.render("lists", { listTitle: "Work List", newTasks: workitems });


});

app.listen(3000, function () {
    console.log("Server started at port 3000");
});