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
	Brand: {
		type: String
	},
	Category: {
		type: String,
		required: true
	},
	DatePurchased: {
		type: Date
	},
	Location: {
		type: String
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
