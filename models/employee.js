const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
	EmployeeNo: {
		type: String,
		required: true
	},
	FirstName: {
		type: String,
		required: true,
	},
	MiddleName: {
		type: String,
	},
	LastName: {
		type: String,
		required: true,
	},
	Image: {
		type: String,
	},
	IsDeleted: {
		type: Boolean,
		required: true,
		default: false
	},
});
module.exports = mongoose.model("employee", employeeSchema);
