const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const { registrationSchema, loginSchema } = require("../validation");

router.post("/register", async (req, res) => {
	//Validate the Data
	const { error } = registrationSchema(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// Email validation
	const emailExist = await User.findOne({ email: req.body.email });
	if (emailExist) return res.status(400).send("Email already exists..");

	//Hashed Password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
	});
	try {
		const savedUser = await user.save();
		res.send({ user: user._id });
	} catch (error) {
		res.status(400).send(error);
	}
});

router.post("/", async (req, res) => {
	//Validate the Data
	const { error } = loginSchema(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// Email validation
	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send("Email doesn't match..");

	//Password validation
	const validPass = await bcrypt.compare(req.body.password, user.password);
	if (!validPass) return res.status(400).send("Password doesn't match");

	//Create and assign token
	const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN, {
		expiresIn: "20s",
	});

	const refreshToken = jwt.sign(
		{ _id: user._id },
		process.env.SECRET_REFRESH_TOKEN,
		{ expiresIn: "1d" }
	);

	// Assigning refresh token in http-only cookie
	res.cookie("jwt", refreshToken, {
		httpOnly: true,
		/* sameSite: "None",
		secure: true, */
		/* sameSite: 'None', secure: true,
		maxAge: 24 * 60 * 60 * 1000 */
	});

	/*res.header("auth-token", token).send({Token : token });*/
	res.header("auth-token", token).send({ results: user, Token: token });
});

router.post("/refresh", (req, res) => {
	console.log("req", req.cookies);
	const refreshToken = req.cookies.jwt;
	//console.log("refresh", refreshToken);
	if (!refreshToken) return res.status(400).send("Access Denied..");

	try {
		const decoded = jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN);
		//console.log("decoded", decoded);
		var userId = decoded._id;
		//Create and assign token
		const token = jwt.sign({ _id: userId }, process.env.SECRET_TOKEN, {
			expiresIn: "20s",
		});

		return res.send({ token });
	} catch {
		return res.status(401).send("unauthorized");
	}
});
// Get specific User
router.get("/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		res.json(user);
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;
