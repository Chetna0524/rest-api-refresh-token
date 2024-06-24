const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

const cors = require("cors");
const dotenv = require("dotenv");
const { checkUser } = require("./routes/verifyToken");

//Import Routes
const postRoute = require("./routes/posts");
const authRoute = require("./routes/auth");

dotenv.config();
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);
app.use(bodyParser.json());
app.use(cookieParser());

//Connect to DB
mongoose.connect(
	process.env.DB_CONNECT,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		writeConcern: { w: "majority", j: true, wtimeout: 1000 },
	},
	() => {
		console.log("Connected");
	}
);

//Middleware
app.use(express.json());

//Routes Middleware
app.use("/posts", postRoute);
app.use("/", authRoute);

// Routes
app.get("*", checkUser);
app.get("/", (req, res) => {
	res.send("Home");
});

app.listen(5000);
