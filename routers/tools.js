const router = require("express").Router();
const bcrypt = require("bcryptjs");
const verify = require("../utils/verifyToken");
const toolsModel = require("../models/tool");
const { toolsValidation, toolsEditValidation } = require("../utils/validation");

//Insert new user to the database
router.post("/", verify, async (request, response) => {
	//Validate before creating
	const { error } = toolsValidation(request.body);
	if (error) return response.status(400).send(error.details[0].message);

	//Check if employee number exist
	const toolsExist = await toolsModel.findOne({
		SerialNo: request.body.serialNo,
	});
	if (toolsExist)
		return response.status(400).send("Serial No was already taken.");

	//Create new user
	const newTool = new toolsModel({
		SerialNo: request.body.serialNo,
		Name: request.body.name,
		Brand: request.body.brand,
		Description: request.body.description,
		Status: request.body.status,
	});
	try {
		const tool = await newTool.save();
		response.status(200).json({ tool: tool.SerialNo + " - " + tool.Name });
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

router.put("/:id", verify, async (request, response) => {
	try {
		const { error } = toolsEditValidation(request.body);
		if (error) return response.status(400).send(error.details[0].message);

		//Check if employee number exist
		const toolsExist = await toolsModel.findOne({
			SerialNo: request.body.SerialNo,
			_id: { $ne: request.params.id}
		});
		if (toolsExist)
			return response.status(400).send("This Serial No. was already taken.");

		const tool = await toolsModel.findById(request.params.id);
		const updates = request.body;
		const options = { new: true };
		const updatedTool = await toolsModel.findByIdAndUpdate(
			tool,
			updates,
			options
		);
		response.status(200).json({ tool: updatedTool.SerialNo + " - (" + updatedTool.Name + ")" });
	} catch (error) {
		response.status(500).json({ error: "Error" });
	}
});

//List of Tools
router.post("/list", verify, async (request, response) => {
	try {
		var page = request.body.page !== "" ? request.body.page : 0;
        var perPage = 12;
		if (Object.keys(request.body.selectedTools).length > 0) {
			var id = [];
			var data = request.body.selectedTools;
			for (const i in data) {
				// console.log(`_id: ${request.body[i].value}`);
				id.push({ _id: request.body.selectedTools[i].value });
			}
			const tools = await toolsModel.find({
				'$or': id,
				IsDeleted: false
			}).skip((page - 1) * perPage).limit(perPage).sort('Name');

			var data = [];
			for (const i in tools) {
				var tool = {
					"_id": tools[i]._id,
					"SerialNo": tools[i].SerialNo,
					"Name": tools[i].Name,
					"Brand": tools[i].Brand,
					"Description": tools[i].Description,
					"Status": tools[i].Status,
				}
				data.push(tool);
			}
			response.status(200).json(data);
		} else {
			const tools = await toolsModel.find({ IsDeleted: false }).skip((page - 1) * perPage).limit(perPage).sort('Name');
			var data = [];
			for (const i in tools) {
				var tool = {
					"_id": tools[i]._id,
					"SerialNo": tools[i].SerialNo,
					"Name": tools[i].Name,
					"Brand": tools[i].Brand,
					"Description": tools[i].Description,
					"Status": tools[i].Status,
				}
				data.push(tool);
			}

			response.status(200).json(data);
		}
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

// list total tools
router.get("/total-tools", async (request, response) => {
	try {
		// const data = await timeLogsModel.find().sort('employeeName');
		const data = await toolsModel.find({ IsDeleted: false });

		response.status(200).json(data.length);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//For search options
router.get("/search-options", verify, async (request, response) => {
	try {
		const tools = await toolsModel.find({ IsDeleted: false }).sort('Name');
		response.status(200).json(tools);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//For search options
router.get("/search-options-st", verify, async (request, response) => {
	try {
		const tools = await toolsModel.find({ IsDeleted: false, Status: "Good" }).sort('Name');
		response.status(200).json(tools);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//Delete user from the database based on id
router.delete("/:id", async (request, response) => {
	try {
		const tool = await toolsModel.findById(request.params.id);
		// const deletedTool = await tool.delete();
		const updates = { IsDeleted: true };
		const options = { new: true };
		const deletedTool = await toolsModel.findByIdAndUpdate(
			tool,
			updates,
			options
		);
		response.status(200).json(deletedTool);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

module.exports = router;
