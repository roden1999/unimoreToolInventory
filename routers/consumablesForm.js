const router = require("express").Router();
const bcrypt = require("bcryptjs");
const verify = require("../utils/verifyToken");
const recordModel = require("../models/record");
const toolModel = require("../models/tool");
const consumableModel = require("../models/consumable");
const employeeModel = require("../models/employee");
const projectModel = require("../models/project");
const consumableFormModel = require("../models/consumableForm");
const { consumableFormValidation, projectValidation } = require("../utils/validation");

//Insert new project to the database
router.post("/add-form", async (request, response) => {
    // Validate before creating
    const { error } = projectValidation(request.body);
    if (error) return response.status(400).send(error.details[0].message);

    //Create new proj
    const newProject = new projectModel({
        ProjectName: request.body.projectName,
        Description: request.body.description,
        Date: request.body.date,
        FormType: "Consumables",
        IsDeleted: false,
    });
    try {
        const project = await newProject.save();
        response.status(200).json({ project: project.ProjectName });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

router.put("edit-form/:id", async (request, response) => {
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

//Insert new item to the database
router.post("/add-item", verify, async (request, response) => {
    //Validate before creating
    const { error } = consumableFormValidation(request.body);
    if (error) return response.status(400).send(error.details[0].message);

    //Check if item exist
    const itemExist = await consumableFormModel.findOne({
        EmployeeId: request.body.employeeId,
        ConsumableId: request.body.consumableId,
        ProjectId: request.body.project,
    });
    if (itemExist)
        return response.status(400).send(`${itemExist.EmployeeId} already borrowed this item.`);
    const item = await consumableModel.findById(request.body.consumableId);
    const options = { new: true };

    if (item.Quantity < request.body.used)
        return response.status(400).send("Inputed Quantity must lower or equal to Item's Quantity.");

    if (request.body.used === 0 || request.body.used === "0")
        return response.status(400).send("Quantity must be greater than 0");

    //Create new record
    const newRecord = new consumableFormModel({
        ConsumableId: request.body.consumableId,
        EmployeeId: request.body.employeeId,
        DateIssued: request.body.dateIssued,
        ProjectId: request.body.project,
        Quantity: request.body.used,
        Status: request.body.status,
        IssuedBy: request.body.issuedBy,
    });

    var qty = item.Used + parseInt(request.body.used);

    const updates = {
        Used: qty,
    }


    try {
        const record = await newRecord.save();
        const updatedRecord = await consumableModel.findByIdAndUpdate(
            item,
            updates,
            options
        );
        response.status(200).json({ record: "Successfully Added." });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (request, response) => {
    try {
        const record = await consumableFormModel.findById(request.params.id);
        const updates = request.body;
        const options = { new: true };
        const updatedRecord = await consumableFormModel.findByIdAndUpdate(
            record,
            updates,
            options
        );
        response.status(200).json({ record: "Successfuly Edited" });
    } catch (error) {
        response.status(500).json({ error: "Error" });
    }
});

//Edit Item
router.put("/edit-item/:id", async (request, response) => {
    try {
        if (request.body.EmployeeId === "")
            return response.status(400).send("Borrower must have value.");

        const record = await consumableFormModel.findById(request.params.id);

        const updates = request.body;
        const options = { new: true };
        const updatedRecord = await consumableFormModel.findByIdAndUpdate(
            record,
            updates,
            options
        );
        response.status(200).json({ record: "Successfuly edit item." });
    } catch (error) {
        response.status(500).json({ error: "Error" });
    }
});

//Add Quantity
router.put("/add-quantity/:id", async (request, response) => {
    try {
        if (request.body.Used === 0 || request.body.Used === "0")
            return response.status(400).send("Quantity must be greater than 0.");

        const record = await consumableFormModel.findById(request.params.id);
        const consumable = await consumableModel.findById(record.ConsumableId);
        if (consumable.Quantity < parseInt(request.body.Used))
            return response.status(400).send("Number inputed cannot be greater than Consumable Stock.");

        var qty = record.Quantity + parseInt(request.body.Used);
        const updates = { Quantity: qty };
        const options = { new: true };
        const updatedRecord = await consumableFormModel.findByIdAndUpdate(
            record,
            updates,
            options
        );

        const updatedConsumableQty = await consumableModel.findByIdAndUpdate(
            consumable,
            { Used: consumable.Used + parseInt(request.body.Used) },
            options
        );
        response.status(200).json({ record: "Successfuly add lend item." });
    } catch (error) {
        response.status(500).json({ error: "Error" });
    }
});

//Subtract Quantity
router.put("/subtract-quantity/:id", async (request, response) => {
    try {
        if (request.body.Used === 0 || request.body.Used === "0")
            return response.status(400).send("Item must be greater than 0.");

        const record = await consumableFormModel.findById(request.params.id);
        const consumable = await consumableModel.findById(record.ConsumableId);
        if (consumable.Quantity < parseInt(request.body.Used))
            return response.status(400).send("Number inputed cannot be greater than Consumable Stock.");

        // if (record.Used < parseInt(request.body.Used))
        //     return response.status(400).send("Quantity inputed cannot be greater than Record's quantity.");

        const updates = { Quantity: record.Quantity - parseInt(request.body.Used) };
        const options = { new: true };
        const updatedRecord = await consumableFormModel.findByIdAndUpdate(
            record,
            updates,
            options
        );

        const updatedConsumableQty = await consumableModel.findByIdAndUpdate(
            consumable,
            { Used: consumable.Used - parseInt(request.body.Used) },
            options
        );
        response.status(200).json({ record: "Successfuly subtract item." });
    } catch (error) {
        response.status(500).json({ error: "Error" });
    }
});

//List of Projects
router.post("/list", verify, async (request, response) => {
    try {
        var page = request.body.page !== "" ? request.body.page : 0;
		var perPage = 20;
        if (Object.keys(request.body.selectedProject).length > 0) {
            var id = [];
            var data = request.body.selectedProject;
            for (const i in data) {
                id.push({ _id: request.body.selectedProject[i].value });
            }
            const projects = await projectModel.find({
                '$or': id,
                IsDeleted: false,
                FormType: "Consumables"
            }).sort('-Date');

            var data = [];
            for (const i in projects) {
                var consumableData = [];

                const records = await consumableFormModel.find({ ProjectId: projects[i]._id }).sort('-DateBorrowed');
                for (const j in records) {
                    var item = await consumableModel.find({ _id: records[j].ConsumableId });
                    var employee = await employeeModel.find({ _id: records[j].EmployeeId });
                    var recordData = {
                        "_id": records[j]._id,
                        "Consumable": item[0].Name,
                        "ConsumableDesc": item[0].Description,
                        "EmployeeId": employee[0]._id,
                        "EmployeeNo": employee[0].EmployeeNo,
                        "EmployeeName": employee[0].FirstName + " " + employee[0].MiddleName + " " + employee[0].LastName,
                        "DateIssued": records[j].DateIssued,
                        "Quantity": records[j].Quantity,
                        // "Project": !project ? "" : project[0].ProjectName,
                        "Status": records[j].Status,
                        "IssuedBy": records[j].IssuedBy,
                    }
                    consumableData.push(recordData);
                }

                var proj = {
                    "_id": projects[i]._id,
                    "ProjectName": projects[i].ProjectName,
                    "Description": projects[i].Description,
                    "Date": projects[i].Date,
                    "IsDeleted": projects[i].IsDeleted,

                    "Data": consumableData
                }
                data.push(proj);
            }
            response.status(200).json(data);
        } else {
            const projects = await projectModel.find({ IsDeleted: false, FormType: "Consumables" }).skip((page - 1) * perPage).limit(perPage).sort('-Date');
            var data = [];
            for (const i in projects) {
                var consumableData = [];

                const records = await consumableFormModel.find({ ProjectId: projects[i]._id }).sort('-DateIssued');
                for (const j in records) {
                    var item = await consumableModel.find({ _id: records[j].ConsumableId });
                    var employee = await employeeModel.find({ _id: records[j].EmployeeId });
                    var recordData = {
                        "_id": records[j]._id,
                        "Consumable": item[0].Name,
                        "ConsumableDesc": item[0].Description,
                        "EmployeeId": employee[0]._id,
                        "EmployeeNo": employee[0].EmployeeNo,
                        "EmployeeName": employee[0].FirstName + " " + employee[0].MiddleName + " " + employee[0].LastName,
                        "DateIssued": records[j].DateIssued,
                        "Quantity": records[j].Quantity,
                        // "Project": !project ? "" : project[0].ProjectName,
                        "Status": records[j].Status,
                        "IssuedBy": records[j].IssuedBy,
                    }
                    consumableData.push(recordData);
                }

                var proj = {
                    "_id": projects[i]._id,
                    "ProjectName": projects[i].ProjectName,
                    "Description": projects[i].Description,
                    "Date": projects[i].Date,
                    "IsDeleted": projects[i].IsDeleted,

                    "Data": consumableData
                }
                data.push(proj);
            }
            response.status(200).json(data);
        }
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

// list total form
router.get("/total-form", async (request, response) => {
    try {
        // const data = await timeLogsModel.find().sort('employeeName');
        const data = await projectModel.find({ IsDeleted: false, FormType: "Consumables" });

        response.status(200).json(data.length);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

//For search options
router.get("/search-options", verify, async (request, response) => {
    try {
        const projects = await projectModel.find({ IsDeleted: false, FormType: "Consumables" }).sort('ProjectName');
        response.status(200).json(projects);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

//Delete form from the database based on id
router.delete("/:id", async (request, response) => {
    try {
        const record = await consumableFormModel.findById(request.params.id);
        const consumable = await consumableModel.findById(record.ConsumableId);
        const options = { new: true };

        const updatedConsumableQty = await consumableModel.findByIdAndUpdate(
            consumable,
            { Used: consumable.Used - parseInt(record.Quantity) },
            options
        );

        const deletedRecord = await record.delete();
        response.status(200).json(deletedRecord);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

module.exports = router;