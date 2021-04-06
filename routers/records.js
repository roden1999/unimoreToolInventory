const router = require("express").Router();
const bcrypt = require("bcryptjs");
const verify = require("../utils/verifyToken");
const recordModel = require("../models/record");
const toolModel = require("../models/tool");
const employeeModel = require("../models/employee");
const { recordAddValidation } = require("../utils/validation");

//Insert new user to the database
router.post("/", verify, async (request, response) => {
	//Validate before creating
	const { error } = recordAddValidation(request.body);
	if (error) return response.status(400).send(error.details[0].message);

	//Check if employee number exist
	const toolsExist = await recordModel.findOne({
		ToolId: request.body.toolId,
	});
	if (toolsExist)
		return response.status(400).json({ message: "Tool already Borrowed by someone." });

	//Create new user
	const newRecord = new recordModel({
		ToolId: request.body.toolId,
		EmployeeId: request.body.employeeId,
		DateBorrowed: request.body.dateBorrowed,
		Project: request.body.project,
		DateReturned: request.body.dateReturned,
		Status: request.body.status,
		ProcessedBy: request.body.processedBy,
		ReceivedBy: request.body.receivedBy
	});
	try {
		const record = await newRecord.save();
		response.status(200).json({ record: "Successfully Borrowed." });
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

router.put("/:id", async (request, response) => {
	try {
		const record = await recordModel.findById(request.params.id);
		const updates = request.body;
		const options = { new: true };
		const updatedRecord = await recordModel.findByIdAndUpdate(
			record,
			updates,
			options
		);
		response.status(200).json({ record: "Successfuly Edited" });
	} catch (error) {
		response.status(500).json({ error: "Error" });
	}
});

//List of Borrowed Tools
router.post("/list-borrowed", async (request, response) => {
	try {
		if (Object.keys(request.body).length > 0) {
			var id = [];
			var data = request.body;
			for (const i in data) {
				// console.log(`_id: ${request.body[i].value}`);
				id.push({ _id: request.body[i].value });
			}
			const records = await recordModel.find({
				'$or': id,
				Status: "Borrowed"
			}).sort('-DateBorrowed');

			var data = [];
			for (const i in records) {
				var tool = await toolModel.find({ _id: records[i].ToolId });
				var employee = await employeeModel.find({ _id: records[i].EmployeeId });
				var recordData = {
					"_id": records[i]._id,
					"SerialNo": tool[0].SerialNo,
					"ToolName": tool[0].Name,
					"EmployeeNo": employee[0].EmployeeNo,
					"EmployeeName": employee[0].FirstName + " " + employee[0].MiddleName + " " + employee[0].LastName,
					"DateBorrowed": records[i].DateBorrowed,
					"Project": records[i].Project,
					"ProcessedBy": records[i].ProcessedBy,
					"Status": records[i].Status,
				}
				data.push(recordData);
			}
			response.status(200).json(data);
		} else {
			const records = await recordModel.find({ Status: "Borrowed" }).sort('-DateBorrowed');
			var data = [];
			for (const i in records) {
				var tool = await toolModel.find({ _id: records[i].ToolId });
				var employee = await employeeModel.find({ _id: records[i].EmployeeId });
				var recordData = {
					"_id": records[i]._id,
					"SerialNo": tool[0].SerialNo,
					"ToolName": tool[0].Name,
					"EmployeeNo": employee[0].EmployeeNo,
					"EmployeeName": employee[0].FirstName + " " + employee[0].MiddleName + " " + employee[0].LastName,
					"DateBorrowed": records[i].DateBorrowed,
					"Project": records[i].Project,
					"ProcessedBy": records[i].ProcessedBy,
					"Status": records[i].Status,
				}
				data.push(recordData);
			}

			response.status(200).json(data);
		}
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//List of Returned Tools
router.post("/list-returned", async (request, response) => {
	try {
		if (Object.keys(request.body).length > 0) {
			var id = [];
			var data = request.body;
			for (const i in data) {
				// console.log(`_id: ${request.body[i].value}`);
				id.push({ _id: request.body[i].value });
			}
			const records = await recordModel.find({
				'$or': id,
				Status: "Returned"
			}).sort('-DateReturned');

			var data = [];
			for (const i in records) {
				var tool = await toolModel.find({ _id: records[i].ToolId });
				var employee = await employeeModel.find({ _id: records[i].EmployeeId });
				var recordData = {
					"_id": records[i]._id,
					"SerialNo": tool[0].SerialNo,
					"ToolName": tool[0].Name,
					"EmployeeNo": employee[0].EmployeeNo,
					"EmployeeName": employee[0].FirstName + " " + employee[0].MiddleName + " " + employee[0].LastName,
					"DateBorrowed": records[i].DateBorrowed,
					"Project": records[i].Project,
					"ProcessedBy": records[i].ProcessedBy,
					"Status": records[i].Status,
				}
				data.push(recordData);
			}
			response.status(200).json(data);
		} else {
			const records = await recordModel.find({ Status: "Returned" }).sort('-DateReturned');
			var data = [];
			for (const i in records) {
				var tool = await toolModel.find({ _id: records[i].ToolId });
				var employee = await employeeModel.find({ _id: records[i].EmployeeId });
				var recordData = {
					"_id": records[i]._id,
					"SerialNo": tool[0].SerialNo,
					"ToolName": tool[0].Name,
					"EmployeeNo": employee[0].EmployeeNo,
					"EmployeeName": employee[0].FirstName + " " + employee[0].MiddleName + " " + employee[0].LastName,
					"DateBorrowed": records[i].DateBorrowed,
					"Project": records[i].Project,
					"ProcessedBy": records[i].ProcessedBy,
					"Status": records[i].Status,
				}
				data.push(recordData);
			}

			response.status(200).json(data);
		}
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

// list total employee
router.get("/total-records", async (request, response) => {
	try {
		// const data = await timeLogsModel.find().sort('employeeName');
		const data = await recordModel.find();

		response.status(200).json(data.length);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//Delete record from the database based on id
router.delete("/:id", async (request, response) => {
	try {
		const record = await recordModel.findById(request.params.id);
		const deletedRecord = await record.delete();
		response.status(200).json(deletedRecord);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

module.exports = router;
