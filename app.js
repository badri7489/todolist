// Requiring the npm modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// console.log(date);

// Starting the express app
const app = express();

// Using body parser for get the form inputs
// Static folders like the css is used with the help of express
// Express JS is set with the help of the view engine
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// The mongoose database is setup at port 27017
mongoose.connect("mongodb://localhost:27017/listDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Items Schema is created
const itemsSchema = new mongoose.Schema({
	name: String,
});

// Item model is created can also be called collections
const Item = mongoose.model("Item", itemsSchema);

// Items are added to the collections(table) Item
const item1 = new Item({
	name: "Welcome to your to do list",
});

const item2 = new Item({
	name: "Hit the + button to add a new item",
});

const item3 = new Item({
	name: "<-- Hit this to delete an item",
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
	Item.find({}, function (err, foundItems) {
		// Here we are first checking if the database is empty or not and then we are inserting the items
		// The items are stored in the foundItems array so if its length is 0 then it is empty then
		// we should insert all the items to the database.
		if (foundItems.length === 0) {
			Item.insertMany(defaultItems, function (err) {
				if (err) {
					console.log(err);
				} else {
					console.log("You are fucking great bitch");
				}
			});
			res.redirect("/");
		} else {
			res.render("list", { listTitle: "Today", newListItem: foundItems });
		}
	});
});

app.post("/", function (req, res) {
	let item = req.body.newItem;
	if (req.body.list === "Work List") {
		workItems.push(item);
		res.redirect("/work");
	} else {
		items.push(item);
		res.redirect("/");
	}
});

app.get("/work", function (req, res) {
	res.render("list", { listTitle: "Work List", newListItem: workItems });
});

// app.post("/work", function (req, res) {
// 	let item = req.body.newItem;
// 	workItems.push(item);
// 	res.redirect("/work");
// });

app.get("/about", function (req, res) {
	res.render("about");
});

app.listen(3000, function () {
	console.log("Jaa... jaa kr port 3000 pe dekh insaan aaya hai ki bhagwan");
});
