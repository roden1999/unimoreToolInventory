import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Card, Icon, Table, TableCell, Pagination } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
const axios = require("axios");
const moment = require("moment");

const customSelectStyle = {
    control: base => ({
        ...base,
        height: 40,
        minHeight: 40,
        borderRadiusTopRight: 0,
        borderRadiusBottomRight: 0,
        // backgroundColor: '#383f48',
    }),
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? 'white' : 'black',
        padding: 20,
        zIndex: 1000
    }),
    singleValue: base => ({
        ...base,
        // color: "#fff"
    }),
    input: base => ({
        ...base,
        // color: "#fff"
    }),
    menu: (provided) => ({ ...provided, zIndex: 9999 }),
};

const Projects = () => {
    const [projectData, setProjectData] = useState(null);
    const [projectOptions, setProjectOptions] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loader, setLoader] = useState(false);
    const [id, setId] = useState(-1);
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(moment());
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    const [borrowModal, setBorrowModal] = useState(false);
    const [returnModal, setReturnModal] = useState(false);
    const [recordId, setRecordId] = useState(-1);
    const [toolData, setToolData] = useState([]);
    const [toolId, setToolId] = useState("");
    const [empData, setEmpData] = useState(null);
    const [employeeId, setEmployeeId] = useState([]);
    const [project, setProject] = useState("");
    const [dateBorrowed, setDateBorrowed] = useState(moment());
    const [processedBy, setProcessedBy] = useState("");
    const [totalForm, setTotalForm] = useState(0);
    const [page, setPage] = useState(1);

    const boundaryRange = 1;
    const siblingRange = 1;
    const showEllipsis = true;
    const showFirstAndLastNav = true;
    const showPreviousAndNextNav = true;

    useEffect(() => {
        var data = {
            selectedProject: !selectedProject ? [] : selectedProject,
            page: page
        };
        var route = "projects/list";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");
        const user = JSON.parse(sessionStorage.getItem('user'));

        axios
            .post(url, data, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (Array.isArray(response.data)) {
                    setProjectData(response.data);
                    setProcessedBy(user.Name)
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setProjectData(obj);
                    setProcessedBy(user.Name)
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [selectedProject, loader]);

    const projectsList = projectData
        ? projectData.map((x) => ({
            id: x._id,
            projectName: x.ProjectName,
            description: x.Description,
            date: x.Date,
            borrowedTools: x.BorrowedTools
        }))
        : [];

        useEffect(() => {
            var route = "projects/total-form";
            var url = window.apihost + route;
            // var token = sessionStorage.getItem("auth-token");
            axios
                .get(url)
                .then(function (response) {
                    // handle success
                    var total = response.data !== "" ? response.data : 0;
                    setTotalForm(total);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .finally(function () {
                    // always executed
                });
        }, [projectOptions, selectedProject, loader]);

        useEffect(() => {
            var route = "projects/search-options";
            var url = window.apihost + route;
            var token = sessionStorage.getItem("auth-token");

            axios
                .get(url, {
                    headers: { "auth-token": token },
                })
                .then(function (response) {
                    // handle success
                    if (Array.isArray(response.data)) {
                        setProjectOptions(response.data);
                    } else {
                        var obj = [];
                        obj.push(response.data);
                        setProjectOptions(obj);
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .finally(function () {
                    // always executed
                });
        }, [loader]);

        const projectsOptionsList = projectOptions
            ? projectOptions.map((x) => ({
                id: x._id,
                name: x.ProjectName + " | " + moment(x.Date).format("MM/DD/yyyy"),
            }))
            : [];

        function ProjectsOption(item) {
            var list = [];
            if (item !== undefined || item !== null) {
                item.map((x) => {
                    return list.push({
                        label: x.name,
                        value: x.id,
                    });
                });
            }
            return list;
        }

        useEffect(() => {
            var route = "employees/search-options";
            var url = window.apihost + route;
            var token = sessionStorage.getItem("auth-token");

            axios
                .get(url, {
                    headers: { "auth-token": token },
                })
                .then(function (response) {
                    // handle success
                    if (Array.isArray(response.data)) {
                        setEmpData(response.data);
                    } else {
                        var obj = [];
                        obj.push(response.data);
                        setEmpData(obj);
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .finally(function () {
                    // always executed
                });
        }, [loader]);

        const employeeOptionsList = empData
            ? empData.map((x) => ({
                id: x._id,
                name: x.FirstName + " " + x.MiddleName + " " + x.LastName,
            }))
            : [];

        function EmployeesOption(item) {
            var list = [];
            if (item !== undefined || item !== null) {
                item.map((x) => {
                    return list.push({
                        label: x.name,
                        value: x.id,
                    });
                });
            }
            return list;
        }

        useEffect(() => {
            var route = "tools/search-options";
            var url = window.apihost + route;
            var token = sessionStorage.getItem("auth-token");

            axios
                .get(url, {
                    headers: { "auth-token": token },
                })
                .then(function (response) {
                    // handle success
                    if (Array.isArray(response.data)) {
                        setToolData(response.data);
                    } else {
                        var obj = [];
                        obj.push(response.data);
                        setToolData(obj);
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .finally(function () {
                    // always executed
                });
        }, [loader]);

        const toolsOptionsList = toolData
            ? toolData.map((x) => ({
                id: x._id,
                name: x.Name,
                serialNo: x.SerialNo
            }))
            : [];

        function ToolsOption(item) {
            var list = [];
            if (item !== undefined || item !== null) {
                item.map((x) => {
                    return list.push({
                        label: x.name + " | " + x.serialNo,
                        value: x.id,
                    });
                });
            }
            return list;
        }

        const handleAddProject = () => {
            var route = "projects/";
            var url = window.apihost + route;
            var token = sessionStorage.getItem("auth-token");

            var data = {
                projectName: projectName,
                description: description,
                date: date,
            }

            setLoader(true);

            axios
                .post(url, data, {
                    headers: {
                        "auth-token": token,
                    },
                })
                .then(function (response) {
                    // handle success
                    toast.success(response.data.project + ' successfully saved.', {
                        position: "top-center"
                    });
                    setAddModal(false);
                    setLoader(false);
                    setId(-1);
                    setProjectName("");
                    setDescription("");
                    setDate(moment());
                })
                .catch(function (error) {
                    // handle error
                    toast.error(JSON.stringify(error.response.data), {
                        position: "top-center"
                    });
                    setLoader(false);
                })
                .finally(function () {
                    // always executed
                });
        }

        const handleCloseAddModal = () => {
            setAddModal(false);
            setId(-1);
            setProjectName("");
            setDescription("");
            setDate(moment());
        }

        const handleEditProjects = () => {
            var route = `projects/${id}`;
            var url = window.apihost + route;
            var token = sessionStorage.getItem("auth-token");

            var data = {
                // id: id,
                ProjectName: projectName,
                Description: description,
                Date: date
            }

            setLoader(true);

            axios
                .put(url, data, {
                    headers: {
                        "auth-token": token,
                    },
                })
                .then(function (response) {
                    // handle success
                    toast.success(response.data.project + ' successfully saved.', {
                        position: "top-center"
                    });
                    setEditModal(false);
                    setLoader(false);
                    setId(-1);
                    setProjectName("");
                    setDescription("");
                    setDate(moment());
                })
                .catch(function (error) {
                    // handle error
                    toast.error(JSON.stringify(error.response.data), {
                        position: "top-center"
                    });
                    setLoader(false);
                })
                .finally(function () {
                    // always executed
                });
        }

        const handleOpenEditModal = (params) => {
            setEditModal(true);
            setId(params.id);
            setProjectName(params.projectName);
            setDescription(params.description);
            setDate(moment(params.date));
        }

        const handleCloseEditModal = () => {
            setEditModal(false);
            setId(-1);
            setProjectName("");
            setDescription("");
        }

        const handleDeleteItem = () => {
            var url = window.apihost + `projects/${id}`;
            var token = sessionStorage.getItem("auth-token");
            setLoader(true);
            axios
                .delete(url, {
                    headers: { "auth-token": token },
                })
                .then(function (response) {
                    // handle success
                    if (response.status <= 200) {
                        toast.success('Form successfully deleted.', {
                            position: "top-center"
                        })
                        setId(-1);
                        setLoader(false);
                        setDeletePopup(false);
                    }
                })
                .catch((err) => {
                    if (err.response.status === 400) {
                        const error = {
                            status: err.response.status,
                            error: err.response.data,
                        };
                        alert(JSON.stringify(error));
                        setLoader(false);
                    } else {
                        // alert(err.response.status + JSON.stringify(err.response.data));
                        const error = {
                            status: err.response.status,
                            error: JSON.stringify(err.response.data),
                        };
                        toast.error(JSON.stringify(error.response.data), {
                            position: "top-center"
                        });
                        setLoader(false);
                    }
                });
        }

        const handleOpenDeletePopup = (id) => {
            setDeletePopup(true);
            setId(id);
        }

        const handleCloseDeleteModal = () => {
            setDeletePopup(false);
            setId(-1);
            setProjectName("");
            setDescription("");
            setDate(moment());
        }

        const handleCloseBorrowModal = () => {
            setBorrowModal(false);
            setToolId("");
            setEmployeeId("");
            setDateBorrowed(moment());
            setProject("");
        }

        const handleAddTools = () => {
            var route = "records/";
            var url = window.apihost + route;
            var token = sessionStorage.getItem("auth-token");

            var data = {
                toolId: toolId.length !== 0 ? toolId.value : "",
                employeeId: employeeId.length !== 0 ? employeeId.value : "",
                dateBorrowed: dateBorrowed,
                project: project,
                dateReturned: "",
                status: "Borrowed",
                processedBy: processedBy,
                receivedBy: ""
            }

            setLoader(true);

            axios
                .post(url, data, {
                    headers: {
                        "auth-token": token,
                    },
                })
                .then(function (response) {
                    // handle success
                    toast.success(response.data.record + ' successfully edited.', {
                        position: "top-center"
                    })
                    setBorrowModal(false);
                    setLoader(false);
                    setToolId("");
                    setEmployeeId("");
                    setDateBorrowed(moment());
                })
                .catch(function (error) {
                    // handle error
                    toast.error(JSON.stringify(error.response.data), {
                        position: "top-center"
                    });
                    setLoader(false);
                })
                .finally(function () {
                    // always executed
                });
        }

        const handleBorrowTool = (id) => {
            setBorrowModal(true);
            setProject(id);
        }

        const handleOpenReturnModal = (params) => {
            setReturnModal(true);
            setRecordId(params);
        }

        const handleCloseReturnModal = () => {
            setReturnModal(false);
            setEmployeeId("");
            setDateBorrowed(moment());
        }

        const handleReturnTools = () => {
            var route = `records/${recordId}`;
            var url = window.apihost + route;
            var token = sessionStorage.getItem("auth-token");

            var data = {
                // toolId: toolId,
                // employeeId: employeeId,
                // dateBorrowed: dateBorrowed,
                // project: project,
                DateReturned: moment().format("MM/DD/yyyy"),
                Status: "Returned",
                // processedBy: "",
                ReceivedBy: processedBy
            }

            setLoader(true);

            axios
                .put(url, data, {
                    headers: {
                        "auth-token": token,
                    },
                })
                .then(function (response) {
                    // handle success
                    toast.success(response.data.record + ' successfully returned.', {
                        position: "top-center"
                    });
                    setReturnModal(false);
                    setLoader(false);
                    setId(-1);
                    setRecordId(-1);
                    setEmployeeId("");
                    setDateBorrowed(moment());
                })
                .catch(function (error) {
                    // handle error
                    alert(error);
                    setLoader(false);
                })
                .finally(function () {
                    // always executed
                });
        }


        return (
            <div>
                <ToastContainer />
                <Button size="large" style={{ float: 'left' }} onClick={() => setAddModal(true)}><Icon name='plus' />Add Form</Button>

                <div style={{
                    float: 'right', width: '30%', zIndex: 100,
                }}>
                    <Select
                        defaultValue={selectedProject}
                        options={ProjectsOption(projectsOptionsList)}
                        onChange={e => setSelectedProject(e)}
                        placeholder='Search...'
                        isClearable
                        isMulti
                        theme={(theme) => ({
                            ...theme,
                            // borderRadius: 0,
                            colors: {
                                ...theme.colors,
                                text: 'black',
                                primary25: '#66c0f4',
                                primary: '#B9B9B9',
                            },
                        })}
                        styles={customSelectStyle}
                    />
                </div>

                <div style={{ paddingTop: 50, }}>
                    <Card.Group itemsPerRow={1} style={{ marginTop: 40, margin: '0 auto', width: '100%', backgroundColor: '#EEEEEE', overflowY: 'scroll', height: '100%', maxHeight: '80vh', }}>
                        {projectsList !== null && loader !== true && projectsList.map(x =>
                            <Card color='blue' key={x.id}>
                                <Card.Content>
                                    <Button size='medium' style={{ float: 'right' }} onClick={() => handleBorrowTool(x.id)}><Icon name='plus' />Add Tool</Button>
                                    <Card.Header>Project Name: {x.projectName}</Card.Header>
                                    <Card.Description>Date: {moment(x.date).format("MMMM DD, yyyy")}</Card.Description>
                                    <Card.Meta>Description: {x.description}</Card.Meta>

                                    <Card.Content>
                                        <Table celled>
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell rowSpan='2'>Tool Name</Table.HeaderCell>
                                                    <Table.HeaderCell rowSpan='2'>Serial No.</Table.HeaderCell>
                                                    <Table.HeaderCell rowSpan='2'>Borrower</Table.HeaderCell>
                                                    <Table.HeaderCell rowSpan='2'>Date Borrowed</Table.HeaderCell>
                                                    <Table.HeaderCell rowSpan='2' style={{ textAlign: 'center' }}>Returned</Table.HeaderCell>
                                                    <Table.HeaderCell rowSpan='2'>Date Returned</Table.HeaderCell>
                                                    <Table.HeaderCell rowSpan='2' style={{ textAlign: 'center' }}>Action</Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            {x.borrowedTools.length !== 0 && x.borrowedTools.map(y =>
                                                <Table.Body>
                                                    <Table.Row>
                                                        <TableCell>{y.ToolName}</TableCell>
                                                        <TableCell>{y.SerialNo}</TableCell>
                                                        <TableCell>{y.EmployeeName}</TableCell>
                                                        <TableCell>{moment(y.DateBorrowed).format("MMM DD, yyyy")}</TableCell>
                                                        <TableCell style={{ textAlign: 'center' }}>{y.Status === "Returned" ? <Icon color='green' size='large' name='checkmark' /> : ""}</TableCell>
                                                        <TableCell>{y.DateReturned ? moment(y.DateReturned).format("MMM DD, yyyy") : ""}</TableCell>
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            <div className='ui one buttons'>
                                                                {y.Status !== "Returned" ?
                                                                    <Button basic color='grey' onClick={() => handleOpenReturnModal(y._id)}>
                                                                        <Icon name='reply' />Return
                                                                </Button>
                                                                    :
                                                                    ""
                                                                }
                                                            </div>
                                                        </TableCell>
                                                    </Table.Row>
                                                </Table.Body>
                                            )}
                                        </Table>
                                    </Card.Content>

                                    <Card.Content extra style={{ marginTop: 10 }}>
                                        <div className='ui two buttons'>
                                            <Button basic color='grey' onClick={() => handleOpenEditModal(x)}>
                                                Edit
                                        </Button>
                                            <Button basic color='grey' onClick={() => handleOpenDeletePopup(x.id)}>
                                                Delete
                                        </Button>
                                        </div>
                                    </Card.Content>
                                </Card.Content>
                            </Card>
                        )}
                    </Card.Group>

                    {projectsList === null || projectsList.length === 0 && loader !== true &&
                        <div style={{ textAlign: 'center', padding: 120 }}>
                            <h1 style={{ color: '#C4C4C4' }}>No data found!</h1>
                        </div>
                    }
                    {loader === true &&
                        <div style={{ margin: '0 auto', textAlign: 'center' }}>
                            <Icon loading name='spinner' size='huge' style={{ color: '#C4C4C4', marginTop: 50 }} />
                        </div>
                    }

                    <Pagination
                        activePage={page}
                        boundaryRange={boundaryRange}
                        onPageChange={(e, { activePage }) => setPage(activePage)}
                        size='mini'
                        siblingRange={siblingRange}
                        totalPages={totalForm / 5}
                        // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
                        ellipsisItem={showEllipsis ? undefined : null}
                        firstItem={showFirstAndLastNav ? undefined : null}
                        lastItem={showFirstAndLastNav ? undefined : null}
                        prevItem={showPreviousAndNextNav ? undefined : null}
                        nextItem={showPreviousAndNextNav ? undefined : null}
                        style={{ float: 'right', marginTop: 20 }}
                    />
                </div>

                <Modal
                    size="mini"
                    open={addModal}
                    onClose={handleCloseAddModal}
                >
                    <Modal.Header>Add New Form</Modal.Header>
                    <Modal.Content>
                        <Form>

                            <Form.Input
                                fluid
                                label='Project Name'
                                placeholder='project name'
                                id='form-input-project-name'
                                size='medium'
                                value={projectName}
                                onChange={e => setProjectName(e.target.value)}
                            />

                            <Form.Input
                                fluid
                                label='Description'
                                placeholder='description'
                                id='form-input-description'
                                size='medium'
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />

                            <label><b>Date</b></label>
                            <input
                                fluid
                                label='Date'
                                placeholder='date'
                                id='form-input-date'
                                size='medium'
                                type='date'
                                value={moment(date).format("yyyy-MM-DD")}
                                onChange={e => setDate(e.target.value)}
                            />
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={handleCloseAddModal}>
                            Cancel
                    </Button>
                        <Button onClick={handleAddProject}>
                            <Icon name='save' />Submit
                    </Button>
                    </Modal.Actions>
                </Modal>

                <Modal
                    size="mini"
                    open={editModal}
                    onClose={handleCloseEditModal}
                >
                    <Modal.Header>Edit Item</Modal.Header>
                    <Modal.Content>
                        <Form>

                            <Form.Input
                                fluid
                                label='Project Name'
                                placeholder='project name'
                                id='form-input-project-name'
                                size='medium'
                                value={projectName}
                                onChange={e => setProjectName(e.target.value)}
                            />

                            <Form.Input
                                fluid
                                label='Description'
                                placeholder='description'
                                id='form-input-description'
                                size='medium'
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />

                            <label><b>Date</b></label>
                            <input
                                fluid
                                label='Date'
                                placeholder='date'
                                id='form-input-date'
                                size='medium'
                                type='date'
                                value={moment(date).format("yyyy-MM-DD")}
                                onChange={e => setDate(e.target.value)}
                            />
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={handleCloseEditModal}>
                            Cancel
                    </Button>
                        <Button onClick={handleEditProjects}>
                            <Icon name='save' />Submit
                    </Button>
                    </Modal.Actions>
                </Modal>

                <Modal
                    open={deletePopup}
                    onClose={handleCloseDeleteModal}
                    size="small"
                >
                    <Modal.Header>Warning!</Modal.Header>

                    <Modal.Content>Are you sure you want to Delete this form?</Modal.Content>

                    <Modal.Actions>
                        <Button onClick={handleCloseDeleteModal}>
                            <Icon name='close' />Cancel
                    </Button>
                        <Button negative onClick={handleDeleteItem}>
                            <Icon name='trash' />Delete
                    </Button>
                    </Modal.Actions>
                </Modal>

                <Modal
                    open={returnModal}
                    onClose={handleCloseReturnModal}
                    size="small"
                >
                    <Modal.Header>Return Tool</Modal.Header>

                    <Modal.Content>Are you sure you want to Return this tool?</Modal.Content>

                    <Modal.Actions>
                        <Button onClick={handleCloseReturnModal}>
                            <Icon name='close' />Cancel
                    </Button>
                        <Button positive onClick={handleReturnTools}>
                            <Icon name='reply' />Return
                    </Button>
                    </Modal.Actions>
                </Modal>

                <Modal
                    size="mini"
                    open={borrowModal}
                    onClose={handleCloseBorrowModal}
                >
                    <Modal.Header>Borrow Tool</Modal.Header>
                    <Modal.Content>
                        <Form>

                            <label><b>Tool</b></label>
                            <Select
                                defaultValue={toolId}
                                options={ToolsOption(toolsOptionsList)}
                                onChange={e => setToolId(e)}
                                placeholder='Tool...'
                                // isClearable
                                // isMulti
                                theme={(theme) => ({
                                    ...theme,
                                    // borderRadius: 0,
                                    colors: {
                                        ...theme.colors,
                                        text: 'black',
                                        primary25: '#66c0f4',
                                        primary: '#B9B9B9',
                                    },
                                })}
                                styles={customSelectStyle}
                            />

                            <br />

                            <label><b>Borrower</b></label>
                            <Select
                                defaultValue={employeeId}
                                options={EmployeesOption(employeeOptionsList)}
                                onChange={e => setEmployeeId(e)}
                                placeholder='Borrower...'
                                theme={(theme) => ({
                                    ...theme,
                                    // borderRadius: 0,
                                    colors: {
                                        ...theme.colors,
                                        text: 'black',
                                        primary25: '#66c0f4',
                                        primary: '#B9B9B9',
                                    },
                                })}
                                styles={customSelectStyle}
                            />

                            <br />

                            <label><b>Date Borrowed</b></label>
                            <input
                                fluid
                                label='Date Borrowed'
                                placeholder='date borrowed'
                                id='form-input-date-borrowed'
                                size='medium'
                                type='date'
                                value={moment(dateBorrowed).format("yyyy-MM-DD")}
                                onChange={e => setDateBorrowed(e.target.value)}
                            />

                            <br />
                            <br />

                            <label><b>Processed By:</b> {processedBy}</label>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={handleCloseBorrowModal}>
                            Cancel
                    </Button>
                        <Button onClick={handleAddTools}>
                            <Icon name='save' />Submit
                    </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }

export default Projects;
