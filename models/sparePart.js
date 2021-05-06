const mongoose = require("mongoose");

const sparePartSchema = new mongoose.Schema({
	Name: {
		type: String,
		required: true,
    },
	Machine: {
		type: String,
        required: true
    },
	Description: {
		type: String,
    },
	Remarks: {
		type: String,
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
module.exports = mongoose.model("sparePart", sparePartSchema);
