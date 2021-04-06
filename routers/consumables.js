const router = require("express").Router();
const bcrypt = require("bcryptjs");
const verify = require("../utils/verifyToken");
const consumableModel = require("../models/consumable");
const { consumableValidation } = require("../utils/validation");

//Insert new user to the database
router.post("/", async (request, response) => {
	//Validate before creating
	const { error } = consumableValidation(request.body);
	if (error) return response.status(400).send(error.details[0].message);

	if (request.body.quantity === 0 || request.body.quantity === "0")
		return response.status(400).send("Quantity must greater than 0.");

	//Check if employee number exist
	const itemExist = await consumableModel.findOne({
		Name: request.body.name,
	});
	if (itemExist)
		return response.status(400).json({ message: "Item already exist." });

	//Create new user
	const newItem = new consumableModel({
		Name: request.body.name,
		Description: request.body.description,
		Quantity: request.body.quantity,
	});
	try {
		const consumable = await newItem.save();
		response.status(200).json({ item: consumable.Name });
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

router.put("/:id", async (request, response) => {
	try {
		const item = await consumableModel.findById(request.params.id);
		const updates = request.body;
		const options = { new: true };
		const updatedItem = await consumableModel.findByIdAndUpdate(
			item,
			updates,
			options
		);
		response.status(200).json({ tool: updatedItem.Name });
	} catch (error) {
		response.status(500).json({ error: "Error" });
	}
});

//List of Tools
router.post("/list", async (request, response) => {
	try {
		if (Object.keys(request.body).length > 0) {
			var id = [];
			var data = request.body;
			for (const i in data) {
				// console.log(`_id: ${request.body[i].value}`);
				id.push({ _id: request.body[i].value });
			}
			const items = await consumableModel.find({
				'$or': id,
				IsDeleted: false
			}).sort('Name');

			var data = [];
			for (const i in items) {
				var item = {
					"_id": items[i]._id,
					"Name": items[i].Name,
					"Description": items[i].Description,
					"Quantity": items[i].Quantity,
				}
				data.push(item);
			}
			response.status(200).json(data);
		} else {
			const items = await consumableModel.find({ IsDeleted: false }).sort('FirstName');
			var data = [];
			for (const i in items) {
				var item = {
					"_id": items[i]._id,
					"Name": items[i].Name,
					"Description": items[i].Description,
					"Quantity": items[i].Quantity,
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
