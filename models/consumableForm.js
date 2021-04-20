const { bool, boolean } = require("@hapi/joi");
const mongoose = require("mongoose");

const consumableFormSchema = new mongoose.Schema({
	ConsumableId: {
		type: String,
		required: true,
    },
	EmployeeId: {
		type: String,
        required: true
    },
	DateIssued: {
		type: Date,
        required: true,
    },
    ProjectId: {
        type: String,
        required: true
    },
    Quantity: {
		type: Number,
        required: true
    },
	Status: {
		type: String,
    },
    IssuedBy: {
        type: String,
    },
});
module.exports = mongoose.model("consumableForm", consumableFormSchema);
