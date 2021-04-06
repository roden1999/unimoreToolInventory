const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema({
	SerialNo: {
		type: String,
		required: true,
	},
	Name: {
		type: String,
		required: true,
    },
	Description: {
		type: String,
    },
	Status: {
		type: String,
    },
	IsDeleted: {
		type: Boolean,
        required: true,
        default: false
    },
});
module.exports = mongoose.model("tool", toolSchema);
