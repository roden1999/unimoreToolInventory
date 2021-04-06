const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
	ToolId: {
		type: String,
		required: true,
    },
	EmployeeId: {
		type: String,
        required: true
    },
	DateBorrowed: {
		type: Date,
        required: true,
    },
    Project: {
        type: String,
    },
    DateReturned: {
		type: Date,
    },
	Status: {
		type: String,
    },
    ProcessedBy: {
        type: String,
    },
    ReceivedBy: {
        type: String,
    },
});
module.exports = mongoose.model("record", recordSchema);
