const router = require("express").Router();
const bcrypt = require("bcryptjs");
const verify = require("../utils/verifyToken");
const projectModel = require("../models/project");
const { projectValidation, projectEditValidation } = require("../utils/validation");
const fs = require("fs");
const multer = require("multer");
const bodyParser = require("body-parser").json();
const upload = multer();
const fileSystem = require("fs");
const { promisify } = require("util");
const { decodeBase64 } = require("bcryptjs");
const pipeline = promisify(require("stream").pipeline);
require("dotenv/config");

//Insert new project to the database
router.post("/", async (request, response) => {
    // Validate before creating
    const { error } = projectValidation(request.body);
    if (error) return response.status(400).send(error.details[0].message);

    //Create new proj
    const newProject = new projectModel({
        ProjectName: request.body.projectName,
        Description: request.body.description,
        IsDeleted: false,
    });
    try {
        const project = await newProject.save();
        response.status(200).json({ project: project.ProjectName });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (request, response) => {
    try {
        const { error } = projectEditValidation(request.body);
        if (error) return response.status(400).send(error.details[0].message);

        const project = await projectModel.findById(request.params.id);
        const updates = request.body;
        const options = { new: true };
        const updatedProject = await projectModel.findByIdAndUpdate(
            project,
            updates,
            options
        );
        response.status(200).json({ project: updatedProject.ProjectName });
    } catch (error) {
        response.status(500).json({ error: "Error" });
    }
});

//List of Projects
router.post("/list", verify, async (request, response) => {
    try {
        if (Object.keys(request.body).length > 0) {
            var id = [];
            var data = request.body;
            for (const i in data) {
                id.push({ _id: request.body[i].value });
            }
            const projects = await projectModel.find({
                '$or': id,
                IsDeleted: false
            }).sort('ProjectName');

            var data = [];
            for (const i in projects) {
                var proj = {
                    "_id": projects[i]._id,
                    "ProjectName": projects[i].ProjectName,
                    "Description": projects[i].Description,
                    "IsDeleted": projects[i].IsDeleted,
                }
                data.push(proj);
            }
            response.status(200).json(data);
        } else {
            const projects = await projectModel.find({ IsDeleted: false }).sort('ProjectName');
            var data = [];
            for (const i in projects) {
                var proj = {
                    "_id": projects[i]._id,
                    "ProjectName": projects[i].ProjectName,
                    "Description": projects[i].Description,
                    "IsDeleted": projects[i].IsDeleted,
                }
                data.push(proj);
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
        const projects = await projectModel.find({ IsDeleted: false }).sort('ProjectName');
        response.status(200).json(projects);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

//Delete project from the database based on id
router.delete("/:id", async (request, response) => {
    try {
        const project = await projectModel.findById(request.params.id);
        // const deletedEmployee = await project.delete();
        const updates = { IsDeleted: true };
        const options = { new: true };
        const deletedEmployee = await projectModel.findByIdAndUpdate(
            project,
            updates,
            options
        );
        response.status(200).json(deletedEmployee);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

module.exports = router;
