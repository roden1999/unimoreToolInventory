const router = require("express").Router();
const bcrypt = require("bcryptjs");
const verify = require("../utils/verifyToken");
const sparePartsModel = require("../models/sparePart");
const { sparePartsValidation, sparePartsEditValidation } = require("../utils/validation");

//Insert new user to the database
router.post("/", verify, async (request, response) => {
	//Validate before creating
	const { error } = sparePartsValidation(request.body);
	if (error) return response.status(400).send(error.details[0].message);

	//Check if employee number exist
	// const spExist = await sparePartsModel.findOne({
	// 	SerialNo: request.body.serialNo,
	// });
	// if (spExist)
	// 	return response.status(400).send("Serial No was already taken.");

	//Create new spare parts
	const newSP = new sparePartsModel({
		Name: request.body.name,
		Machine: request.body.machine,
		Description: request.body.description,
		Remarks: request.body.remarks,
		Status: request.body.status,
	});
	try {
		const sp = await newSP.save();
		response.status(200).json({ sp: sp.Name });
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

router.put("/:id", verify, async (request, response) => {
	try {
		const { error } = sparePartsEditValidation(request.body);
		if (error) return response.status(400).send(error.details[0].message);

		const sp = await sparePartsModel.findById(request.params.id);
		const updates = request.body;
		const options = { new: true };
		const updatedSp = await sparePartsModel.findByIdAndUpdate(
			sp,
			updates,
			options
		);
		response.status(200).json({ tool: updatedSp.Name });
	} catch (error) {
		response.status(500).json({ error: "Error" });
	}
});

//List of Tools
router.post("/list", verify, async (request, response) => {
	try {
		var page = request.body.page !== "" ? request.body.page : 0;
        var perPage = 10;
		if (Object.keys(request.body.selectedSp).length > 0) {
			var id = [];
			var data = request.body.selectedSp;
			for (const i in data) {
				// console.log(`_id: ${request.body[i].value}`);
				id.push({ _id: request.body.selectedSp[i].value });
			}
			const sp = await sparePartsModel.find({
				'$or': id,
                Machine: request.body.machine,
				IsDeleted: false
			}).skip((page - 1) * perPage).limit(perPage).sort('Name');

			var data = [];
			for (const i in sp) {
				var sparePart = {
					"_id": sp[i]._id,
					"Name": sp[i].Name,
					"Machine": sp[i].Machine,
					"Description": sp[i].Description,
					"Remarks": sp[i].Remarks,
					"Status": sp[i].Status,
				}
				data.push(sparePart);
			}
			response.status(200).json(data);
		} else {
			const sp = await sparePartsModel.find({ IsDeleted: false, Machine: request.body.machine }).skip((page - 1) * perPage).limit(perPage).sort('Name');
			var data = [];
			for (const i in sp) {
				var sparePart = {
					"_id": sp[i]._id,
					"Name": sp[i].Name,
					"Machine": sp[i].Machine,
					"Description": sp[i].Description,
					"Remarks": sp[i].Remarks,
					"Status": sp[i].Status,
				}
				data.push(sparePart);
			}

			response.status(200).json(data);
		}
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

// list total sp
router.post("/sp-tools", async (request, response) => {
	try {
		// const data = await timeLogsModel.find().sort('employeeName');
		const data = await sparePartsModel.find({ IsDeleted: false, Machine: request.body.machine });

		response.status(200).json(data.length);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//For search options
router.post("/search-options", verify, async (request, response) => {
	try {
		const spareParts = await sparePartsModel.find({ IsDeleted: false, Machine: request.body.machine }).sort('Name');
		response.status(200).json(spareParts);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//Delete sp from the database based on id
router.delete("/:id", async (request, response) => {
	try {
		const sp = await sparePartsModel.findById(request.params.id);
		// const deletedTool = await tool.delete();
		const updates = { IsDeleted: true };
		const options = { new: true };
		const deletedSP = await sparePartsModel.findByIdAndUpdate(
			sp,
			updates,
			options
		);
		response.status(200).json(deletedSP);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

module.exports = router;
