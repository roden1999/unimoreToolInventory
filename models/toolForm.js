const { bool, boolean } = require("@hapi/joi");
const mongoose = require("mongoose");

const toolFormSchema = new mongoose.Schema({
	ProjectName: {
		type: String,
		required: true,
    },
	Description: {
		type: String,
    },
	Date: {
		type: Date,
		required: true
	},
	IsDeleted: {
		type: Boolean,
        required: true,
        default: false
    },
});
module.exports = mongoose.model("toolForm", toolFormSchema);
