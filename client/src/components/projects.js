import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Card, Icon, Table, TableCell, Pagination, Menu, Grid, List, Segment, Label, Input } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
const axios = require("axios");
const moment = require("moment");

const customMultiSelectStyle = {
    clearIndicator: (ci) => ({
        ...ci
        // backgroundColor: '#383f48',
    }),
    dropdownIndicator: (ci) => ({
        ...ci
        // backgroundColor: "#383f48"
    }),
    indicatorsContainer: (ci) => ({
        ...ci,
        color: "red",
        // backgroundColor: "#383f48",
        position: "sticky",
        top: 0,
        height: "40px",
        zIndex: "100"
    }),
    control: (base) => ({
        ...base,
        height: 40,
        minHeight: 40,
        overflowX: "hidden",
        overflowY: "auto",
        borderRadiusTopRight: 0,
        borderRadiusBottomRight: 0,
        width: "100%"
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
    multiValue: (styles, { data }) => {
        return {
            ...styles,
            backgroundColor: "#1E8EFF",
        };
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: "#00000",
    }),
    input: base => ({
        ...base,
        // color: "#fff"
    }),
    menu: (provided) => ({ ...provided, zIndex: 9999 }),
};

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
    const [selectedProject, setSelectedProject] = useState([]);
    const [loader, setLoader] = useState(false);
    const [id, setId] = useState(-1);
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState([]);
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
    const [remarks, setRemarks] = useState("");
    const [fromDate, setFromDate] = useState(moment().startOf('month').format('MM/DD/yyyy'));
    const [toDate, setToDate] = useState(moment().format('MM/DD/yyyy'));
    const [editItem, setEditItem] = useState(false);
    const [itemId, setItemId] = useState(-1);
    const [projId, setProjId] = useState("");
    const [totalForm, setTotalForm] = useState(0);
    const [page, setPage] = useState(1);

    const boundaryRange = 0;
    const siblingRange = 0;
    const showEllipsis = true;
    const showFirstAndLastNav = true;
    const showPreviousAndNextNav = true;

    useEffect(() => {
        var data = {
            selectedProject: !selectedProject ? [] : selectedProject,
            fromDate: fromDate,
            toDate: toDate,
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
    }, [selectedProject, fromDate, toDate, page, loader]);

    const projectsList = projectData
        ? projectData.map((x) => ({
            id: x._id,
            projectName: x.ProjectName,
            description: x.Description,
            status: x.Status,
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
            status: status ? status.value : "",
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
                setStatus([]);
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
            Date: date,
            Status: status ? status.value : "",
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
                setStatus([]);
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
        var stat = [{ label: params.status, value: params.status }]
        setEditModal(true);
        setId(params.id);
        setProjectName(params.projectName);
        setDescription(params.description);
        setDate(moment(params.date));
        setStatus(stat)
    }

    const handleCloseEditModal = () => {
        setEditModal(false);
        setId(-1);
        setProjectName("");
        setDescription("");
        setStatus([]);
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
        setStatus([])
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
            receivedBy: "",
            remarks: remarks
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
                setRemarks("");
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
        setRecordId(params._id);
        setRemarks(params.Remarks)
    }

    const handleCloseReturnModal = () => {
        setReturnModal(false);
        setEmployeeId("");
        setDateBorrowed(moment());
        setRemarks("");
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
            DateReturned: moment(),
            Status: "Returned",
            // processedBy: "",
            ReceivedBy: processedBy,
            Remarks: remarks
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
                setRemarks("");
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

    const handleEditItem = (params) => {
        var tool = [{ value: params.ToolId, label: params.ToolName }];
        var borrower = [{ value: params.EmployeeId, label: params.EmployeeName }];
        setEditItem(true);
        setItemId(params._id);
        setToolId(tool);
        setEmployeeId(borrower);
        setDateBorrowed(moment(params.DateBorrowed));
        setRemarks(params.remarks)
    }

    const handleCancelEditItem = () => {
        setEditItem(false);
        setItemId(-1);
        setToolId("");
        setEmployeeId("");
        setDateBorrowed(moment());
        setRemarks("");
    }

    const handleSubmitEditItem = () => {
        var route = `records/edit-item/${itemId}`;
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var data = {
            ToolId: toolId ? toolId.value : "",
            EmployeeId: employeeId ? employeeId.value : "",
            DateBorrowed: dateBorrowed,
            Remarks: remarks
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
                toast.success(response.data.record + ' successfully saved.', {
                    position: "top-center"
                });
                setLoader(false);
                setEditItem(false);
                setItemId(-1);
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

    function StatusOption() {
        var list = [
            { value: "On Going", label: "On Going" },
            { value: "Finished", label: "Finished" },
        ];
        return list;
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
                    styles={customMultiSelectStyle}
                />
            </div>

            <Grid style={{ width: '100%', }}>
                <Grid.Column width={3} style={{ height: '100%', }}>
                    <Menu fluid vertical size='massive' color="blue" style={{ height: '100%', minHeight: '74vh', maxHeight: '74vh' }}>

                        <Menu.Item
                            color="blue"
                            style={{ backgroundColor: "#B9B9B9" }}
                        >
                            <h4 style={{ textAlign: 'center' }}>PROJECT</h4>
                        </Menu.Item>

                        <div style={{ overflowY: 'scroll', height: '100%', minHeight: '60vh', maxHeight: '60vh' }}>
                            {projectsList !== null && loader !== true && projectsList.map(x =>
                                <Menu.Item
                                    active={x.id === projId}
                                    onClick={() => setProjId(x.id)}
                                    color="blue"
                                >
                                    <Grid>
                                        <Grid.Column width={13}>
                                            <List size='mini' animated>
                                                <List.Item>
                                                    <List.Content>
                                                        <List.Header>{x.projectName}</List.Header>
                                                        <List.Description>{moment(x.date).format("MMMM DD, yyyy")}</List.Description>
                                                        <List.Description>{x.description}</List.Description>
                                                        <List.Description>
                                                            {x.status !== "" ?
                                                                <Label color={x.status !== "On Going" ? "green" : "blue"}>{x.status}</Label> :
                                                                ""
                                                            }
                                                        </List.Description>
                                                    </List.Content>
                                                </List.Item>
                                            </List>
                                        </Grid.Column>
                                        <Grid.Column width={0}>
                                            <div style={{ float: "right", marginLeft: 30 }}>
                                                <Button circular size="mini" icon='edit' onClick={() => handleOpenEditModal(x)} /><br />
                                                <Button circular size="mini" icon='trash' onClick={() => handleOpenDeletePopup(x.id)} style={{ marginTop: 5, zIndex: 1000 }} />
                                            </div>
                                        </Grid.Column>
                                    </Grid>
                                </Menu.Item>
                            )}

                            {projectsList === null || projectsList.length === 0 && loader !== true &&
                                <div style={{ textAlign: 'center', marginTop: 50 }}>
                                    <h4 style={{ color: '#C4C4C4' }}>No Project found!</h4>
                                </div>
                            }

                            {loader === true &&
                                <div style={{ margin: '0 auto', textAlign: 'center' }}>
                                    <Icon loading name='spinner' size='medium' style={{ color: '#C4C4C4', marginTop: 50 }} />
                                </div>
                            }
                        </div>
                        <Menu.Item>
                            {Object.keys(selectedProject).length === 0 &&
                                <Pagination
                                    activePage={page}
                                    boundaryRange={boundaryRange}
                                    onPageChange={(e, { activePage }) => setPage(activePage)}
                                    size='mini'
                                    siblingRange={siblingRange}
                                    totalPages={totalForm / 20}
                                    // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
                                    ellipsisItem={showEllipsis ? undefined : null}
                                    firstItem={showFirstAndLastNav ? undefined : null}
                                    lastItem={showFirstAndLastNav ? undefined : null}
                                    prevItem={showPreviousAndNextNav ? undefined : null}
                                    nextItem={showPreviousAndNextNav ? undefined : null}
                                    style={{}}
                                />
                            }
                        </Menu.Item>
                    </Menu>
                </Grid.Column>

                <Grid.Column stretched width={13}>
                    <Segment style={{ marginTop: 20, height: '100%', minHeight: '72vh', maxHeight: '72vh' }}>
                        {projId !== "" && projectsList !== null && loader !== true && projectsList.map(x =>
                            <div color='blue' key={x.id}>
                                {x.id === projId &&
                                    <div>
                                        <Button size='medium' style={{ float: 'right', marginBottom: 10 }} onClick={() => handleBorrowTool(x.id)}><Icon name='plus' />Add Tool</Button>
                                        <Input type="date" label="To Date" style={{ float: 'right', marginRight: 10 }} value={toDate} onChange={e => setToDate(e.target.value)} />
                                        <Input type="date" label="From Date" style={{ float: 'right', marginRight: 10 }} value={fromDate} onChange={e => setFromDate(e.target.value)} />

                                        <div style={{ width: "100%", overflowY: 'scroll', height: '100%', maxHeight: '60vh' }}>
                                            <Table celled color="blue">
                                                <Table.Header style={{ position: "sticky", top: 0 }}>
                                                    <Table.Row>
                                                        <Table.HeaderCell rowSpan='2'>Tool Name</Table.HeaderCell>
                                                        <Table.HeaderCell rowSpan='2'>Serial No.</Table.HeaderCell>
                                                        <Table.HeaderCell rowSpan='2'>Borrower</Table.HeaderCell>
                                                        <Table.HeaderCell rowSpan='2'>Date Borrowed</Table.HeaderCell>
                                                        <Table.HeaderCell rowSpan='2' style={{ textAlign: 'center' }}>Returned</Table.HeaderCell>
                                                        <Table.HeaderCell rowSpan='2'>Date Returned</Table.HeaderCell>
                                                        <Table.HeaderCell rowSpan='2'>Remarks</Table.HeaderCell>
                                                        <Table.HeaderCell rowSpan='2' style={{ textAlign: 'center' }}>Action</Table.HeaderCell>
                                                    </Table.Row>
                                                </Table.Header>
                                                {x.id === projId && x.borrowedTools.length !== 0 && x.borrowedTools.map(y =>
                                                    <Table.Body>
                                                        <Table.Row>
                                                            <TableCell>{y.ToolName}</TableCell>
                                                            <TableCell>{y.SerialNo}</TableCell>
                                                            <TableCell>{y.EmployeeName}</TableCell>
                                                            <TableCell>{moment(y.DateBorrowed).format("MMM DD, yyyy")}</TableCell>
                                                            <TableCell style={{ textAlign: 'center' }}>{y.Status === "Returned" ? <Icon color='green' size='large' name='checkmark' /> : ""}</TableCell>
                                                            <TableCell>{y.DateReturned ? moment(y.DateReturned).format("MM/DD/yyyy | h:mm a") : ""}</TableCell>
                                                            <TableCell>{y.Remarks}</TableCell>
                                                            <TableCell style={{ textAlign: 'center' }}>
                                                                <div className='ui one buttons'>
                                                                    {y.Status !== "Returned" ?
                                                                        <Button.Group>
                                                                            <Button basic color='grey' onClick={() => handleEditItem(y)}>
                                                                                <Icon name='edit' />Edit
                                                                            </Button>
                                                                            <Button basic color='grey' onClick={() => handleOpenReturnModal(y)}>
                                                                                <Icon name='reply' />Return
                                                                            </Button>
                                                                        </Button.Group>
                                                                        :
                                                                        ""
                                                                    }
                                                                </div>
                                                            </TableCell>
                                                        </Table.Row>
                                                    </Table.Body>
                                                )}
                                            </Table>
                                        </div>
                                    </div>
                                }

                                {/* <div className='ui two buttons'>
                                    <Button basic color='grey' onClick={() => handleOpenEditModal(x)}>
                                        Edit
                                    </Button>
                                    <Button basic color='grey' onClick={() => handleOpenDeletePopup(x.id)}>
                                        Delete
                                    </Button>
                                </div> */}
                            </div>
                        )}
                        {projId === "" && loader !== true &&
                            <h1 style={{ textAlign: 'center', marginTop: '20%', color: '#C4C4C4' }}>Select a Project to View Borrowed Tools.</h1>
                        }

                        {loader === true &&
                            <div style={{ margin: '0 auto', textAlign: 'center' }}>
                                <Icon loading name='spinner' size='huge' style={{ color: '#C4C4C4', marginTop: 50 }} />
                            </div>
                        }
                    </Segment>
                </Grid.Column>
            </Grid>

            {/* <div style={{ paddingTop: 50, }}>
                <Card.Group itemsPerRow={1} style={{ marginTop: 40, margin: '0 auto', width: '100%', backgroundColor: '#EEEEEE', overflowY: 'scroll', height: '100%', maxHeight: '70vh', }}>
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
                                                    <TableCell>{y.DateReturned ? moment(y.DateReturned).format("MMM DD, yyyy | HH:mm a") : ""}</TableCell>
                                                    <TableCell style={{ textAlign: 'center' }}>
                                                        <div className='ui one buttons'>
                                                            {y.Status !== "Returned" ?
                                                                <Button.Group>
                                                                    <Button basic color='grey' onClick={() => handleEditItem(y)}>
                                                                        <Icon name='edit' />Edit
                                                                    </Button>
                                                                    <Button basic color='grey' onClick={() => handleOpenReturnModal(y._id)}>
                                                                        <Icon name='reply' />Return
                                                                    </Button>
                                                                </Button.Group>
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

                {Object.keys(selectedProject).length === 0 &&
                    < Pagination
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
                }
            </div> */}

            <Modal
                size="mini"
                open={addModal}
                onClose={handleCloseAddModal}
            >
                <Modal.Header>Add New Tool Form</Modal.Header>
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

                        <br />

                        <label><strong>Status</strong></label>
                        <Select
                            defaultValue={status}
                            options={StatusOption()}
                            onChange={e => setStatus(e)}
                            placeholder='Status...'
                            isClearable
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

                        <br />

                        <label><strong>Status</strong></label>
                        <Select
                            defaultValue={status}
                            options={StatusOption()}
                            onChange={e => setStatus(e)}
                            placeholder='Status...'
                            isClearable
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
                size="mini"
                open={editItem}
                onClose={handleCancelEditItem}
            >
                <Modal.Header>Edit Item</Modal.Header>
                <Modal.Content>
                    <Form>

                        <label><b>Tool</b></label>
                        <Select
                            defaultValue={toolId}
                            options={ToolsOption(toolsOptionsList)}
                            onChange={e => setToolId(e)}
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

                        <label><b>Date Issued</b></label>
                        <input
                            fluid
                            label='Date Issued'
                            placeholder='date issued'
                            id='form-input-date-issued'
                            size='medium'
                            type='date'
                            value={moment(dateBorrowed).format("yyyy-MM-DD")}
                            onChange={e => setDateBorrowed(e.target.value)}
                        />
                        <br />
                        <br />

                        <Form.Input
                            fluid
                            label='Remarks'
                            placeholder='remarks'
                            id='form-input-remarks'
                            size='medium'
                            value={remarks}
                            onChange={e => setRemarks(e.target.value)}
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleCancelEditItem}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmitEditItem}>
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

                <Modal.Content>
                    <Form>
                        <Form.Input
                            fluid
                            label='Remarks'
                            placeholder='remarks'
                            id='form-input-remarks'
                            size='medium'
                            value={remarks}
                            onChange={e => setRemarks(e.target.value)}
                        />
                    </Form>
                </Modal.Content>

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

                        <Form.Input
                            fluid
                            label='Remarks'
                            placeholder='remarks'
                            id='form-input-remarks'
                            size='medium'
                            value={remarks}
                            onChange={e => setRemarks(e.target.value)}
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
