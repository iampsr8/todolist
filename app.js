import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
// console.log(__dirname);
// const express = require("express");
// const bodyParser = require("body-parser");
// import E from "express";
import express from "express";
import bodyParser from "body-parser";
import getDate from "./date.js";
import mongoose from "mongoose";
// const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true})
const itemsSchema = new mongoose.Schema({
  name:String
})
const Item=mongoose.model('item',itemsSchema)

const food = new Item({
  name:'Buy Food'
})
const code = new Item({
  name:'Code'
})

const defaultItems=[food,code]





app.get("/", (req, res) => {

  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Successfully inserted default items');
        }
      }) 
    }
    res.render("list", { listTitle: day, newListItems: foundItems })
  })

  const day = getDate();
  // 
  // console.log(__dirname + "/index.html");
  // res.sendFile(__dirname + "/index.html");
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work list", newListItems: workList });
});

app.get("/about", (req, res) => {
  res.render("about");
});
app.post("/", (req, res) => {
  const item = req.body.item;
  if (req.body.button === "Work list") {
    workList.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});
