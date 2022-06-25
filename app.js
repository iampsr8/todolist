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
// const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const items = ["buy food"];
const workList = [];
// const days = [
//   "sunday",
//   "monday",
//   "tuesday",
//   "wednesday",
//   "thursday",
//   "friday",
//   "saturday",
// ];
app.get("/", (req, res) => {
  const day = getDate();
  res.render("list", { listTitle: day, newListItems: items });
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
