const Joi = require("@hapi/joi");

const registrationSchema = (data) => {
	//Validation schema
	const schema = Joi.object({
		name: Joi.string().min(6).required(),
		email: Joi.string().min(6).required().email(),
		password: Joi.string().required(),
	});
	return schema.validate(data);
};

const loginSchema = (data) => {
	//Validation schema
	const schema = Joi.object({
		email: Joi.string().min(6).required().email(),
		password: Joi.string().required(),
	});
	return schema.validate(data);
};

module.exports.registrationSchema = registrationSchema;
module.exports.loginSchema = loginSchema;
