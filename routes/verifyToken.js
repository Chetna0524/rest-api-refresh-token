const jwt = require("jsonwebtoken");
const User = require("../models/User");

/*module.exports = function(req,res,next) {
	const token = req.header('auth-token');
	if(!token) return res.status(400).send("Access Denied..");

	try{
		const verified = jwt.verify(token, process.env.SECRET_TOKEN);
		req.user = verified;
		next(); 
	}catch(error){
		res.status(400).send("Invalid Token...")
	}

}*/

const verifyUser = (req, res, next) => {
	const token = req.header("auth-token");
	if (!token) return res.status(400).send("Access Denied..");

	try {
		const verified = jwt.verify(token, process.env.SECRET_TOKEN);
		req.user = verified;
		next();
	} catch (error) {
		res.status(401).send("Invalid Token...");
	}
};

/*module.exports = function(req,res) {
	const token = req.header('auth-token');
	if(!token) return res.status(400).send("Access Denied..");
	
		try{
			const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
			req.user = decoded;
			 var userId = decoded._id;
	        // Fetch the user by id 
	        User.findOne({_id: userId}).then(function(user){
	            // Do something with the user
	            return res.send(user);
	        });

		}catch{
			 return res.status(401).send('unauthorized');
		}

	

}*/

const checkUser = (req, res) => {
	const token = req.header("auth-token");
	if (!token) return res.status(400).send("Access Denied..");

	try {
		const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
		var userId = decoded._id;
		// Fetch the user by id
		User.findOne({ _id: userId }).then(function (user) {
			// Do something with the user
			return res.send(user);
		});
	} catch (err) {
		return res.status(401).send("unauthorized");
	}
};

/*

const verifyUser = (req,res,next) => {
	const token = req.header('auth-token');
	if(!token) return res.status(400).send("Access Denied..");

	try{
		const verified = jwt.verify(token, process.env.SECRET_TOKEN);
		req.user = verified;
		next(); 
	}catch(error){
		res.status(400).send("Invalid Token...")
	}

};


const checkUser = (req,res,next) => {
	const token = req.header('auth-token');
	
	if(token){
		jwt.verify(token, process.env.SECRET_TOKEN,  async function(err, decoded) {
		  if(err){
		  	console.log(err.message);	
		  	res.locals.user = null;	  	
		  	next();
		  }else{
		  	console.log("Decoded checkUser",decoded);
		  	let user = await User.findById(decoded._id);
		  	res.locals.user = user;	  
		  	next();
		  }

		});
	}else{
		res.locals.user = null;
		next()
	}

};
*/

module.exports = { verifyUser, checkUser };
