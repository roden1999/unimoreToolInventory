const router = require("express").Router();
const bcrypt = require("bcryptjs");
const verify = require("../utils/verifyToken");
const consumableModel = require("../models/consumable");
const { consumableValidation, consumableEditValidation } = require("../utils/validation");

//Insert new user to the database
router.post("/", async (request, response) => {
	//Validate before creating
	const { error } = consumableValidation(request.body);
	if (error) return response.status(400).send(error.details[0].message);

	// if (request.body.quantity === 0 || request.body.quantity === "0")
	// 	return response.status(400).send("Quantity must greater than 0.");

	//Check if employee number exist
	// const itemExist = await consumableModel.findOne({
	// 	Name: request.body.name,
	// });
	// if (itemExist)
	// 	return response.status(400).send("Item already exist.");

	//Create new user
	const newItem = new consumableModel({
		Name: request.body.name,
		Brand: request.body.brand,
		Unit: request.body.unit,
		DatePurchased: request.body.datePurchased,
		Description: request.body.description,
		Quantity: request.body.quantity,
		Used: request.body.used,
	});
	try {
		const consumable = await newItem.save();
		response.status(200).json({ consumable: consumable.Name });
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

router.put("/:id", async (request, response) => {
	try {
		//Validate before creating
		const { error } = consumableEditValidation(request.body);
		if (error) return response.status(400).send(error.details[0].message);

		// if (request.body.Quantity === 0 || request.body.Quantity === "0")
		// 	return response.status(400).send("Quantity must greater than 0.");

		if (request.body.Quantity < request.body.used)
			return response.status(400).send("Item Used must less than Item's Quantity.");

		const item = await consumableModel.findById(request.params.id);
		const updates = request.body;
		const options = { new: true };
		const updatedItem = await consumableModel.findByIdAndUpdate(
			item,
			updates,
			options
		);
		response.status(200).json({ consumable: updatedItem.Name });
	} catch (error) {
		response.status(500).json({ error: "Error" });
	}
});

//List of Tools
router.post("/list", async (request, response) => {
	try {
		var page = request.body.page !== "" ? request.body.page : 0;
		var perPage = 12;
		if (Object.keys(request.body.selectedConsumables).length > 0) {
			var id = [];
			var data = request.body.selectedConsumables;
			for (const i in data) {
				// console.log(`_id: ${request.body[i].value}`);
				id.push({ _id: request.body.selectedConsumables[i].value });
			}
			const items = await consumableModel.find({
				'$or': id,
				IsDeleted: false
			}).sort('Name');

			var data = [];
			for (const i in items) {
				var critlvl = ((items[i].Quantity - items[i].Used) * 100) / items[i].Quantity;
				var item = {
					"_id": items[i]._id,
					"Name": items[i].Name,
					"Brand": items[i].Brand,
					"Unit": items[i].Unit,
					"DatePurchased": items[i].DatePurchased,
					"Description": items[i].Description,
					"Quantity": items[i].Quantity,
					"Used": items[i].Used,
					"CritLevelPercentage": critlvl,
					"CritLevel": critlvl <= 40 ? true : false,
				}
				data.push(item);
			}
			response.status(200).json(data);
		} else {
			const items = await consumableModel.find({ IsDeleted: false }).skip((page - 1) * perPage).limit(perPage).sort('Name');
			var data = [];
			for (const i in items) {
				var critlvl = ((items[i].Quantity - items[i].Used) * 100) / items[i].Quantity;
				var item = {
					"_id": items[i]._id,
					"Name": items[i].Name,
					"Brand": items[i].Brand,
					"Unit": items[i].Unit,
					"DatePurchased": items[i].DatePurchased,
					"Description": items[i].Description,
					"Quantity": items[i].Quantity,
					"Used": items[i].Used,
					"CritLevelPercentage": critlvl.toFixed(2),
					"CritLevel": critlvl <= 40 ? true : false,
				}
				data.push(item);
			}

			response.status(200).json(data);
		}
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//For search options
router.get("/search-options", verify, async (request, response) => {
	try {
		const item = await consumableModel.find({ IsDeleted: false }).sort('Name');
		response.status(200).json(item);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

// list total tools
router.get("/total-item", async (request, response) => {
	try {
		// const data = await timeLogsModel.find().sort('employeeName');
		const data = await consumableModel.find({ IsDeleted: false });

		response.status(200).json(data.length);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//Delete user from the database based on id
router.delete("/:id", verify, async (request, response) => {
	try {
		const consumable = await consumableModel.findById(request.params.id);
		// const deletedItem = await consumable.delete();
		const updates = { IsDeleted: true };
		const options = { new: true };
		const deletedItem = await consumableModel.findByIdAndUpdate(
			consumable,
			updates,
			options
		);
		response.status(200).json(deletedItem);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

module.exports = router;
