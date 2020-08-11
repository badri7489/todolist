const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.get("/", function (req, res) {
	res.send("Hello Raand");
});

app.listen(3000, function () {
	console.log("Jaa... jaa kr port 3000 pe dekh insaan aaya hai ki bhagwan");
});
