const router = require("express").Router();
const bcrypt = require("bcryptjs");
const verify = require("../utils/verifyToken");
const recordModel = require("../models/record");
const toolModel = require("../models/tool");
const employeeModel = require("../models/employee");
const projectModel = require("../models/project");
const { recordAddValidation } = require("../utils/validation");

//Insert new user to the database
router.post("/", verify, async (request, response) => {
	//Validate before creating
	const { error } = recordAddValidation(request.body);
	if (error) return response.status(400).send(error.details[0].message);

	//Check if employee number exist
	const toolsExist = await recordModel.findOne({
		ToolId: request.body.toolId,
		Status: "Borrowed"
	});
	if (toolsExist)
		return response.status(400).send("Tool already Borrowed by someone.");

	//Create new user
	const newRecord = new recordModel({
		ToolId: request.body.toolId,
		EmployeeId: request.body.employeeId,
		DateBorrowed: request.body.dateBorrowed,
		ProjectId: request.body.project,
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
		var page = request.body.page !== "" ? request.body.page : 0;
        var perPage = 12;
		if (Object.keys(request.body.searchTool).length > 0) {
			var id = [];
			var data = request.body.searchTool;
			for (const i in data) {
				// console.log(`_id: ${request.body[i].value}`);
				id.push({ ToolId: request.body.searchTool[i].value });
			}
			const records = await recordModel.find({
				'$or': id,
				Status: "Borrowed"
			}).skip((page - 1) * perPage).limit(perPage).sort('-DateBorrowed');

			var data = [];
			for (const i in records) {
				var tool = await toolModel.find({ _id: records[i].ToolId });
				var employee = await employeeModel.find({ _id: records[i].EmployeeId });
				var project = await projectModel.find({ _id: records[i].ProjectId });
				var recordData = {
					"_id": records[i]._id,
					"SerialNo": tool[0].SerialNo,
					"ToolName": tool[0].Name,
					"EmployeeNo": employee[0].EmployeeNo,
					"EmployeeName": employee[0].FirstName + " " + employee[0].MiddleName + " " + employee[0].LastName,
					"DateBorrowed": records[i].DateBorrowed,
					"Project": !project ? "" : project[0].ProjectName,
					"ProcessedBy": project[i].ProcessedBy,
					"Status": records[i].Status,
				}
				data.push(recordData);
			}
			response.status(200).json(data);
		} else {
			const records = await recordModel.find({ Status: "Borrowed" }).skip((page - 1) * perPage).limit(perPage).sort('-DateBorrowed');
			var data = [];
			for (const i in records) {
				var tool = await toolModel.find({ _id: records[i].ToolId });
				var employee = await employeeModel.find({ _id: records[i].EmployeeId });
				var project = "";
				if (records[i].ProjectId !== "") 
					project = await projectModel.find({ _id: records[i].ProjectId });
				
				var recordData = {
					"_id": records[i]._id,
					"SerialNo": tool[0].SerialNo,
					"ToolName": tool[0].Name,
					"EmployeeNo": employee[0].EmployeeNo,
					"EmployeeName": employee[0].FirstName + " " + employee[0].MiddleName + " " + employee[0].LastName,
					"DateBorrowed": records[i].DateBorrowed,
					"Project": !project ? "" : project[0].ProjectName,
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
		var page = request.body.page !== "" ? request.body.page : 0;
        var perPage = 12;
		if (Object.keys(request.body.searchTool).length > 0) {
			var id = [];
			var data = request.body.searchTool;
			for (const i in data) {
				// console.log(`_id: ${request.body[i].value}`);
				id.push({ ToolId: request.body.searchTool[i].value });
			}
			const records = await recordModel.find({
				'$or': id,
				Status: "Returned"
			}).skip((page - 1) * perPage).limit(perPage).sort('-DateReturned');

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
					"Project": records[i].ProjectId,
					"ProcessedBy": records[i].ProcessedBy,
					"ReceivedBy": records[i].ReceivedBy,
					"Status": records[i].Status,
				}
				data.push(recordData);
			}
			response.status(200).json(data);
		} else {
			const records = await recordModel.find({ Status: "Returned" }).skip((page - 1) * perPage).limit(perPage).sort('-DateReturned');
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
					"Project": records[i].ProjectId,
					"ProcessedBy": records[i].ProcessedBy,
					"ReceivedBy": records[i].ReceivedBy,
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

// list total total borrowed
router.get("/total-borrowed", async (request, response) => {
	try {
		// const data = await timeLogsModel.find().sort('employeeName');
		const data = await recordModel.find({ Status: "Borrowed" });

		response.status(200).json(data.length);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

// list total total returned
router.get("/total-returned", async (request, response) => {
	try {
		// const data = await timeLogsModel.find().sort('employeeName');
		const data = await recordModel.find({ Status: "Returned" });

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
