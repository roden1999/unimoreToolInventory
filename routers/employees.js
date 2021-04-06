const router = require("express").Router();
const bcrypt = require("bcryptjs");
const verify = require("../utils/verifyToken");
const employeeModel = require("../models/employee");
const recordModel = require("../models/record");
const toolModel = require("../models/tool");
const { employeeValidation, employeeEditValidation } = require("../utils/validation");
const fs = require("fs");
const multer = require("multer");
const bodyParser = require("body-parser").json();
const upload = multer();
const fileSystem = require("fs");
const { promisify } = require("util");
const { decodeBase64 } = require("bcryptjs");
const pipeline = promisify(require("stream").pipeline);
require("dotenv/config");


//GET evacuee head images from public\images folder -- separated
router.get("/images", (request, response) => {
	response.sendFile(path.join(__dirname, "app_data"));
	//sample use - localhost:5000/images/imgName.jpg
});

//Insert new user to the database
router.post("/", bodyParser, async (request, response) => {
	// Validate before creating
	const { error } = employeeValidation(request.body);
	if (error) return response.status(400).send(error.details[0].message);

	//Check if employee number exist
	const employeeNoExist = await employeeModel.findOne({
		employeeNo: request.body.employeeNo,
	});
	if (employeeNoExist)
		return response.status(400).json({ message: "Employee already exist." });

	const imgdata = request.body.image;

	const imgName = imgdata ? request.body.firstName.replace(/\s+/g, '') + "_" + request.body.employeeNo.replace(/\s+/g, '') + ".jpg" : "";

	//Upload images to server
	// to convert base64 format into random filename
	if (imgdata) {
		const base64Data =
			imgdata === null || imgdata === undefined
				? ""
				: imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, "");

		// to declare some path to store your converted image
		const path = `${__dirname}/../app_data/images/${imgName}`;
		fs.writeFileSync(path, base64Data, { encoding: "base64" });
	}

	//Create new user
	const newEmployee = new employeeModel({
		EmployeeNo: request.body.employeeNo,
		FirstName: request.body.firstName,
		MiddleName: request.body.middleName,
		LastName: request.body.lastName,
		Image: imgName,
	});
	try {
		const employee = await newEmployee.save();
		response.status(200).json({ employee: employee.employeeNo + " - " + employee.firstName });
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

router.put("/:id", async (request, response) => {
	try {
		const { error } = employeeEditValidation(request.body);
		if (error) return response.status(400).send(error.details[0].message);

		const employee = await employeeModel.findById(request.params.id);
		const updates = request.body;
		const options = { new: true };
		const updatedEmployee = await employeeModel.findByIdAndUpdate(
			employee,
			updates,
			options
		);
		response.status(200).json({ employee: updatedEmployee.EmployeeNo + " - " + updatedEmployee.FirstName + " " + updatedEmployee.MiddleName + " " + updatedEmployee.LastName });
	} catch (error) {
		response.status(500).json({ error: "Error" });
	}
});

//List of Employee
router.post("/list", verify, async (request, response) => {
	try {
		if (Object.keys(request.body).length > 0) {
			var id = [];
			var data = request.body;
			for (const i in data) {
				// console.log(`_id: ${request.body[i].value}`);
				id.push({ _id: request.body[i].value });
			}
			const employees = await employeeModel.find({
				'$or': id,
				IsDeleted: false
			}).sort('FirstName');

			var data = [];
			for (const i in employees) {
				const records = await recordModel.find({ EmployeeId: employees[i]._id });
				var BorrowedTools = [];
				var TotalBorrowed = 0;

				for (const i in records) {
					var toolName = await toolModel.findById(records[i].ToolId);
					var tools = {
						"id": records[i]._id,
						"toolName": toolName,
						"dateBorrowed": records[i].DateBorrowed,
						"project": records[i].Project,
						"dateReturned": records[i].DateReturned,
						"status": records[i].Status,
						"processedBy": records[i].ProcessedBy,
						"receivedBy": records[i].ReceivedBy,
					}
					BorrowedTools.push(tools);

					TotalBorrowed += 1;
				}

				var emp = {
					"_id": employees[i]._id,
					"EmployeeNo": employees[i].EmployeeNo,
					"FirstName": employees[i].FirstName,
					"MiddleName": employees[i].MiddleName,
					"LastName": employees[i].LastName,
					"Image": employees[i].Image,

					"TotalBorrowed": TotalBorrowed,
					"BorrowedTools": [BorrowedTools]
				}
				data.push(emp);
			}
			response.status(200).json(data);
		} else {
			const employees = await employeeModel.find({ IsDeleted: false }).sort('FirstName');
			var data = [];
			for (const i in employees) {
				const records = await recordModel.find({ EmployeeId: employees[i]._id });
				var BorrowedTools = [];
				var TotalBorrowed = 0;

				for (const i in records) {
					var toolName = await toolModel.findById(records[i].ToolId);
					var tools = {
						"id": records[i]._id,
						"toolName": toolName.Name,
						"serialNo": toolName.SerialNo,
						"dateBorrowed": records[i].DateBorrowed,
						"project": records[i].Project,
						"dateReturned": records[i].DateReturned,
						"status": records[i].Status,
						"processedBy": records[i].ProcessedBy,
						"receivedBy": records[i].ReceivedBy,
					}
					BorrowedTools.push(tools);

					TotalBorrowed += 1;
				}

				var emp = {
					"_id": employees[i]._id,
					"EmployeeNo": employees[i].EmployeeNo,
					"FirstName": employees[i].FirstName,
					"MiddleName": employees[i].MiddleName,
					"LastName": employees[i].LastName,
					"Image": employees[i].Image,

					"TotalBorrowed": TotalBorrowed,
					"BorrowedTools": BorrowedTools
				}
				data.push(emp);
			}
			response.status(200).json(data);
		}
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

// list total employee
router.get("/total-employees", async (request, response) => {
	try {
		// const data = await timeLogsModel.find().sort('employeeName');
		const data = await employeeModel.find({ IsDeleted: false });

		response.status(200).json(data.length);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//For search options
router.get("/search-options", verify, async (request, response) => {
	try {
		const employees = await employeeModel.find({ IsDeleted: false }).sort('FirstName');
		response.status(200).json(employees);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//Delete user from the database based on id
router.delete("/:id", async (request, response) => {
	try {
		const employee = await employeeModel.findById(request.params.id);
		// const deletedEmployee = await employee.delete();
		const updates = { IsDeleted: true };
        const options = { new: true };
        const deletedEmployee = await employeeModel.findByIdAndUpdate(
            employee,
            updates,
            options
        );
		response.status(200).json(deletedEmployee);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

module.exports = router;
