const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.get("/", function (req, res) {
	var today = new Date();
	var currentDay = today.getDay();
	var day = "";
	switch (currentDay) {
		case 0:
			day = "Raviwar";
			break;
		case 1:
			day = "Somwar";
			break;
		case 2:
			day = "Mangalwar";
			break;
		case 3:
			day = "Budhwar";
			break;
		case 4:
			day = "Guruwar";
			break;
		case 5:
			day = "Shukrawar";
			break;
		case 6:
			day = "Shaniwar";
			break;
	}
	res.render("list", { kindOfDay: day });
});

app.listen(3000, function () {
	console.log("Jaa... jaa kr port 3000 pe dekh insaan aaya hai ki bhagwan");
});
