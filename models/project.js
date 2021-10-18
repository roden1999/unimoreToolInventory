const { bool, boolean } = require("@hapi/joi");
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
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
    FormType: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        required: true
    },
	IsDeleted: {
		type: Boolean,
        required: true,
        default: false
    },
});
module.exports = mongoose.model("project", projectSchema);
