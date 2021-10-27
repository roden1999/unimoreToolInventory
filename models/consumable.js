const mongoose = require("mongoose");

const consumableSchema = new mongoose.Schema({
	Name: {
		type: String,
		required: true,
    },
	Brand: {
		type: String,
    },
	Unit: {
		type: String
	},
	DatePurchased: {
		type: Date,
	},
	Description: {
		type: String,
    },
	Quantity: {
		type: Number,
        required: true,
    },
	Used: {
		type: Number,
        required: true,
    },
	CriticalLevel: {
		type: Number,
		required: true,
	},
	IsDeleted: {
		type: Boolean,
        required: true,
        default: false
    },
});
module.exports = mongoose.model("consumable", consumableSchema);
