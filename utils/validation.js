//Validation
const Joi = require("@hapi/joi");
const { allow } = require("@hapi/joi");

//Login Validation
const loginValidation = (data) => {
	const schema = Joi.object({
		userName: Joi.string().required().messages({
			"string.empty": `User Name is required`,
		}),
		password: Joi.string().required().messages({
			"string.empty": `Password is required`,
		}),
	});
	return schema.validate(data, { abortEarly: false });
};

//Employee Validation
const employeeValidation = (data) => {
	const schema = Joi.object({
		employeeNo: Joi.string().required().messages({
			"string.empty": `Employee No. is required`,
		}),
		firstName: Joi.string().required().messages({
			"string.empty": `First Name is required`,
		}),
		middleName: Joi.string().allow(''),
		lastName: Joi.string().required().messages({
			"string.empty": `Last Name. is required`,
		}),
		image: Joi.string().allow(''),
	});
	return schema.validate(data, { abortEarly: false });
};

//Edit Employee Validation
const employeeEditValidation = (data) => {
	const schema = Joi.object({
		_id: Joi.string().required().messages({
			"string.empty": `ID is required`
		}),
		EmployeeNo: Joi.string().required().messages({
			"string.empty": `Employee No. is required`,
		}),
		FirstName: Joi.string().required().messages({
			"string.empty": `First Name is required`,
		}),
		MiddleName: Joi.string().allow(''),
		LastName: Joi.string().required().messages({
			"string.empty": `Last Name. is required`,
		}),
	});
	return schema.validate(data, { abortEarly: false });
};

//Regsistration Validation
const registrationValidation = (data) => {
	const schema = Joi.object({
		userName: Joi.string().required().messages({
			"string.empty": `Username is required.`,
		}),
		name: Joi.string().required().messages({
			"string.empty": `Name is required.`,
		}),
		password: Joi.string().required().messages({
			"string.empty": `Password is required.`,
		}),
		confirmPassword: Joi.string().required().messages({
			"string.empty": `Confirm Password is required.`,
		}),
		role: Joi.string().required().messages({
			"string.empty": `Role is required.`,
		}),
	});
	return schema.validate(data, { abortEarly: false });
};

//Tools Validation
const toolsValidation = (data) => {
	const schema = Joi.object({
		serialNo: Joi.string().required().messages({
			"string.empty": `SN is required.`
		}),
		name: Joi.string().required().messages({
			"string.empty": "Name is required."
		}),
		description: Joi.string().allow(''),
		status: Joi.string().allow(''),
	});
	return schema.validate(data, { abortEarly: false });
};

//Tools Validation
const consumableValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().required().messages({
			"string.empty": "Name is required."
		}),
		quantity: Joi.number().required().messages({
			"string.empty": `Quantity must have value.`
		}),
		description: Joi.string().allow(''),
	});
	return schema.validate(data, { abortEarly: false });
};

//Record Validation
const recordAddValidation = (data) => {
	const schema = Joi.object({
		toolId: Joi.string().required().messages({
			"string.empty": "Tool Id is required."
		}),
		employeeId: Joi.string().required().messages({
			"string.empty": `Employee is required.`
		}),
		dateBorrowed: Joi.string().required().messages({
			"string.empty": `Date is required.`
		}),
		status: Joi.string().required().messages({
			"string.empty": `Status is required.`
		}),
		project: Joi.string().allow(''),
		dateReturned: Joi.string().allow(''),
		processedBy: Joi.string().allow(''),
		receivedBy: Joi.string().allow(''),
	});
	return schema.validate(data, { abortEarly: false });
};

//Project Validation
const projectValidation = (data) => {
	const schema = Joi.object({
		projectName: Joi.string().required().messages({
			"string.empty": "Tool Id is required."
		}),
		description: Joi.string().allow(''),
	});
	return schema.validate(data, { abortEarly: false });
};

//Project Validation
const projectEditValidation = (data) => {
	const schema = Joi.object({
		ProjectName: Joi.string().required().messages({
			"string.empty": "Tool Id is required."
		}),
		Description: Joi.string().allow(''),
	});
	return schema.validate(data, { abortEarly: false });
};

module.exports.loginValidation = loginValidation;
module.exports.employeeValidation = employeeValidation;
module.exports.employeeEditValidation = employeeEditValidation;
module.exports.registrationValidation = registrationValidation;
module.exports.toolsValidation = toolsValidation;
module.exports.consumableValidation = consumableValidation;
module.exports.recordAddValidation = recordAddValidation;
module.exports.projectValidation = projectValidation;
module.exports.projectEditValidation = projectEditValidation;
