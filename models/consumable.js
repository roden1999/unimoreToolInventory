const mongoose = require("mongoose");

const consumableSchema = new mongoose.Schema({
	Name: {
		type: String,
		required: true,
    },
	Description: {
		type: String,
    },
	Quantity: {
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
