import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));


import express from "express";
import bodyParser from "body-parser";
import getDate from "./date.js";
import mongoose from "mongoose";
import _ from "lodash";
// const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin-prateek:Prateek8@cluster0.epb4t.mongodb.net/todolistDB", { useNewUrlParser: true})
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

const listSchema = new mongoose.Schema({
  name: String,
  items:[itemsSchema]
})

const List=mongoose.model('List',listSchema)



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



app.get('/:customListName', (req, res) => {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        //create a new list
        const list = new List({
          name: customListName,
          items:defaultItems
        })
        list.save();
        res.redirect('/' + customListName)
      } else {
        //show an existing list
        res.render('list',{ listTitle: customListName, newListItems: foundList.items })
      }
    }
  })
  
})

app.post("/", (req, res) => {
  // console.log(req.body);
  const itemName = _.capitalize(req.body.item);
  // console.log(req.body);
  const listName=req.body.list.trim()
  const item = new Item({
    name:itemName
  })
  const day = getDate();
  if (listName === day) {
    item.save()
    res.redirect('/')
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      // console.log(foundList);
      // console.log(itemName);
      // console.log(listName);
      if (err) {
        console.log(err);
      } else {
        // console.log(req.body);
        // console.log(foundList);
        foundList.items.push(item)
      foundList.save();
      res.redirect('/' + listName)
      }
    })
  }
  

});

app.post('/delete', (req, res) => {

  const ItemId = req.body.checkbox;
  const listName = req.body.listName.trim();
  const checkedItemId=ItemId.trim()
  const date = getDate();
  if (listName === date) {
    Item.findByIdAndRemove(checkedItemId, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("successfully deleted");
      }
    })
    res.redirect('/');
  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, (err, foundList) => {
      if (!err) {
        res.redirect('/'+listName)
      }
    })
  }
  
})

let port = process.env.PORT;
if (port == null || port === '') {
  port = 3000;
}



app.listen(port, () => {
  console.log("server has started succesfully");
});
