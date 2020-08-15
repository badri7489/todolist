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

const listSchema = new mongoose.Schema({
	name: String,
	items: [itemsSchema],
});

// Item model is created can also be called collections
const Item = mongoose.model("Item", itemsSchema);

const List = mongoose.model("List", listSchema);

// Items are added to the collections(table) Item.
// It can also be called documents(actually it is called documents in nosql languages)
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

app.get("/:customListName", function (req, res) {
	const customListName = req.params.customListName;

	List.findOne({ name: customListName }, function (err, results) {
		if (!err) {
			if (results) {
				// Show an existing list
				res.render("list", { listTitle: results.name, newListItem: results.items });
			} else {
				// Create a new list
				const list = new List({
					name: customListName,
					items: defaultItems,
				});
				list.save();
				res.redirect("/" + customListName);
			}
		}
	});
});

app.get("/about", function (req, res) {
	res.render("about");
});

app.post("/", function (req, res) {
	const itemName = req.body.newItem;
	const listName = req.body.list;

	const newItem = new Item({
		name: itemName,
	});
	if (listName === "Today") {
		newItem.save();
		res.redirect("/");
	} else {
		List.findOne({ name: listName }, function (err, foundList) {
			foundList.items.push(newItem);
			foundList.save();
			res.redirect("/" + listName);
			if (err) {
				console.log(err);
			} else {
				console.log("Suck cess");
			}
		});
	}
});

app.post("/delete", function (req, res) {
	const checkedItemId = req.body.checkbox;
	const listName = req.body.listName;
	// console.log(listName);
	if (listName === "Today") {
		Item.findByIdAndRemove({ _id: checkedItemId }, function (err) {
			if (!err) {
				// console.log("Successfully Deleted!");
				res.redirect("/");
			}
		});
	} else {
		List.findOneAndUpdate(
			{ name: listName },
			{ $pull: { items: { _id: checkedItemId } } },
			function (err, foundList) {
				if (!err) {
					// console.log("Jhaant delete kr diye bhsdk!!");
					res.redirect("/" + listName);
				}
			}
		);
	}
});

// app.post("/work", function (req, res) {
// 	let item = req.body.newItem;
// 	workItems.push(item);
// 	res.redirect("/work");
// });

app.listen(3000, function () {
	console.log("Jaa... jaa kr port 3000 pe dekh insaan aaya hai ki bhagwan");
});
