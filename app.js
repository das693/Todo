// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const { getDate } = require("./date");
const date = require(__dirname + "/date.js");
console.log(getDate());

const app = express();


var items = [];
var workitems = [];

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {

    let today = date.getDate();
    res.render("lists", { listTitle: today, newTasks: items });

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