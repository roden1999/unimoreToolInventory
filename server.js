const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectToMongodb = require("./utils/connectToMongodb");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const { PORT } = require("./config");

connectToMongodb();

app.use(express.json({ limit: '50mb' }));
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
// parse application/json
app.use(bodyParser.json({ limit: '50mb' }));

//Images / Files middleware
app.use(express.static(path.join(__dirname, "/app_data")));

//app.use(express.static("client/build"));

// Route to login
const loginRouter = require("./routers/login");
app.use("/login", loginRouter);

// Route to users
const usersRouter = require("./routers/user");
app.use("/users", usersRouter);

// Route to employees
const employeesRouter = require("./routers/employees");
app.use("/employees", employeesRouter);

// Route to projects
const projectsRouter = require("./routers/projects");
app.use("/projects", projectsRouter);

// Route to tools
const spRouter = require("./routers/spareParts");
app.use("/spareParts", spRouter);

// Route to tools
const toolsRouter = require("./routers/tools");
app.use("/tools", toolsRouter);

// Route to consumables
const consumablesRouter = require("./routers/consumables");
app.use("/consumables", consumablesRouter);

// Route to consumable form
const consumablesFormRouter = require("./routers/consumablesForm");
app.use("/consumablesForm", consumablesFormRouter);

// Route to records
const recordsRouter = require("./routers/records");
app.use("/records", recordsRouter);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static("client/build"));
}

app.listen(PORT, () => {
	console.log(`Server Started`);
});