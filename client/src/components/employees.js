import React, { useState, useEffect } from 'react'
import { Pagination, Form, Button, Card, Icon, Table, TableCell, Image, Modal, } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
const axios = require("axios");

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
        // color: state.isSelected ? 'white' : 'black',
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

const Employees = () => {
    const [employeesData, setEmployeesData] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState([]);
    const [loader, setLoader] = useState(false);
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [id, setId] = useState(-1);
    const [employeeNo, setEmployeeNo] = useState('');
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [image, setImage] = useState("");
    const [imageB64, setImageB64] = useState('');
    const [deletePopup, setDeletePopup] = useState(false);
    const [totalEmployee, setTotalEmployee] = useState(0);
    const [page, setPage] = useState(1);

    const boundaryRange = 1;
    const siblingRange = 1;
    const showEllipsis = true;
    const showFirstAndLastNav = true;
    const showPreviousAndNextNav = true;

    useEffect(() => {
        var data = {
            selectedEmployee: selectedEmployee,
            page: page
        };
        var route = "employees/list";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        axios
            .post(url, data, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (Array.isArray(response.data)) {
                    setEmployeesData(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setEmployeesData(obj);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [selectedEmployee, loader, page]);

    const employeesList = employeesData
        ? employeesData.map((x) => ({
            id: x._id,
            employeeNo: x.EmployeeNo,
            firstName: x.FirstName,
            middleName: x.MiddleName,
            lastName: x.LastName,
            image: x.Image,

            totalBorrowed: x.TotalBorrowed,
            borrowedTools: x.BorrowedTools
        }))
        : [];

    useEffect(() => {
        var route = "employees/total-employees";
        var url = window.apihost + route;
        // var token = sessionStorage.getItem("auth-token");
        axios
            .get(url)
            .then(function (response) {
                // handle success
                var total = response.data !== "" ? response.data : 0;
                setTotalEmployee(total);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [employeeOptions, selectedEmployee, loader]);

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
                    setEmployeeOptions(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setEmployeeOptions(obj);
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

    const employeeOptionsList = employeeOptions
        ? employeeOptions.map((x) => ({
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

    const covertToBase64 = (e) => {
        return new Promise((resolve, reject) => {
            var file = e.target.files[0];

            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (err) => {
                reject(err);
            };
        })
    }

    const handleAddEmployee = async (e) => {
        var route = "employees/";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var data = {
            employeeNo: employeeNo,
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            image: imageB64,
        }

        setLoader(true);

        axios
            .post(url, data, {
                headers: {
                    "auth-token": token,
                    // "content-type": "multipart/form-data"
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            })
            .then(function (response) {
                // handle success
                toast.success(response.data.employee + ' successfully saved.', {
                    position: "top-center"
                });
                setAddModal(false);
                setLoader(false);
                setId(-1);
                setEmployeeNo('');
                setFirstName('');
                setMiddleName('');
                setLastName('');
                setImage('');
                setImageB64("");
            })
            .catch(function (error) {
                // handle error
                toast.error(error.response.data, {
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
        setEmployeeNo('');
        setFirstName('');
        setMiddleName('');
        setLastName('');
        setImage('');
        setImageB64("");
    }

    const handleCloseEditModal = () => {
        setEditModal(false);
        setId(-1);
        setEmployeeNo('');
        setFirstName('');
        setMiddleName('');
        setLastName('');
        setImage('');
        setImageB64("");
    }

    const handleEditEmployee = () => {
        var route = `employees/${id}`;
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var data = {
            _id: id,
            EmployeeNo: employeeNo,
            FirstName: firstName,
            MiddleName: middleName,
            LastName: lastName,
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
                toast.success(response.data.employee + ' successfully edited.', {
                    position: "top-center"
                });
                setEditModal(false);
                setLoader(false);
                setId(-1);
                setEmployeeNo('');
                setFirstName('');
                setMiddleName('');
                setLastName('');
                setImage('');
                setImageB64("");
            })
            .catch(function (error) {
                // handle error
                toast.error(error.response.data, {
                    position: "top-center"
                });
                setLoader(false);
            })
            .finally(function () {
                // always executed
            });
    }

    const handleDeleteEmployee = () => {
        var url = window.apihost + `employees/${id}`;
        var token = sessionStorage.getItem("auth-token");
        setLoader(true);
        axios
            .delete(url, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (response.status <= 200) {
                    toast.success('Employee successfully deleted.', {
                        position: "top-center"
                    });
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
                    toast.error(error.response.data, {
                        position: "top-center"
                    });
                    setLoader(false);
                } else {
                    // alert(err.response.status + JSON.stringify(err.response.data));
                    const error = {
                        status: err.response.status,
                        error: JSON.stringify(err.response.data),
                    };
                    alert(JSON.stringify(error));
                    setLoader(false);
                }
            });
    }

    const handleOpenDeletePopup = (id) => {
        setDeletePopup(true);
        setId(id);
    }

    const handleOpenEditModal = (params) => {
        setEditModal(true);
        setId(params.id);
        setEmployeeNo(params.employeeNo);
        setFirstName(params.firstName);
        setMiddleName(params.middleName);
        setLastName(params.lastName);
    }

    const handleCloseDeleteModal = () => {
        setDeletePopup(false);
        setId(-1);
        setEmployeeNo('');
        setFirstName('');
        setMiddleName('');
        setLastName('');
        setImage('');
        setImageB64("");
    }

    const handleFile = async (file) => {
        setImage(file.target.files[0]);

        if (file) {
            const base64 = await covertToBase64(file);
            setImageB64(base64);
        }
    }


    return (
        <div>
            <div>
                <ToastContainer />
                <Button size='large' style={{ float: 'left' }} onClick={() => setAddModal(true)}><Icon name='plus' />Add Employee</Button>

                <div style={{
                    float: 'right', width: '30%', zIndex: 100,
                }}>
                    <Select
                        defaultValue={selectedEmployee}
                        options={EmployeesOption(employeeOptionsList)}
                        onChange={e => setSelectedEmployee(e)}
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
            </div>

            <div style={{ paddingTop: 50, }}>
                <Card.Group itemsPerRow={2} style={{ marginTop: 40, margin: '0 auto', width: '100%', backgroundColor: '#EEEEEE', overflowY: 'scroll', height: '100%', maxHeight: '80vh', }}>
                    {employeesList !== null && loader !== true && employeesList.map(x =>
                        <Card color='blue' key={x.id}>
                            <Card.Content>
                                <Image
                                    floated='right'
                                    size='mini'
                                    style={{ width: 55, height: 55 }}
                                    src={x.image !== "" ? window.apihost + "images/" + x.image : window.apihost + "images/default.jpg"}
                                />
                                <Card.Header>{x.firstName + " " + x.middleName + " " + x.lastName}</Card.Header>
                                <Card.Meta>{x.employeeNo}</Card.Meta>
                                <Card.Description>
                                    Total Borrowed Tools: <strong>{x.totalBorrowed}</strong>
                                </Card.Description>
                            </Card.Content>

                            <Card.Content>
                                <Table celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell rowSpan='2'>Tool Name</Table.HeaderCell>
                                            <Table.HeaderCell rowSpan='2'>Serial No.</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>

                                    {x.borrowedTools !== null && x.borrowedTools.map(y =>
                                        <Table.Body>
                                            <Table.Row>
                                                <TableCell>{y.toolName}</TableCell>
                                                <TableCell>{y.serialNo}</TableCell>
                                            </Table.Row>
                                        </Table.Body>
                                    )}
                                </Table>
                            </Card.Content>

                            <Card.Content extra>
                                <div className='ui two buttons'>
                                    <Button basic color='grey' onClick={() => handleOpenEditModal(x)}>
                                        Edit
                                    </Button>
                                    <Button basic color='grey' onClick={() => handleOpenDeletePopup(x.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </Card.Content>
                        </Card>
                    )}
                </Card.Group>

                {employeesList === null || employeesList.length === 0 && loader !== true &&
                    <div style={{ textAlign: 'center', padding: 120 }}>
                        <h1 style={{ color: "#C4C4C4" }}>No data found!</h1>
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
                    totalPages={totalEmployee / 12}
                    // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
                    ellipsisItem={showEllipsis ? undefined : null}
                    firstItem={showFirstAndLastNav ? undefined : null}
                    lastItem={showFirstAndLastNav ? undefined : null}
                    prevItem={showPreviousAndNextNav ? undefined : null}
                    nextItem={showPreviousAndNextNav ? undefined : null}
                    style={{ float: 'right', marginTop: 10 }}
                />
            </div>

            <Modal
                size="mini"
                open={addModal}
                onClose={handleCloseAddModal}
            >
                <Modal.Header>Add New Employee</Modal.Header>
                <Modal.Content>
                    <Form>
                        {/* image !== null &&
                            <Image src={image.files} size='medium' circular />
                         */}

                        {/* <br /> */}

                        {/* <Form.Input
                            fluid
                            label='Image'
                            placeholder='image'
                            id='form-input-img'
                            size='medium'
                            // value={image
                            type='file'
                            accept='.jpeg, .png, .jpg'
                            onChange={e => handleFile(e)}
                        /> */}

                        <Form.Input
                            fluid
                            label='Employee No.'
                            placeholder='employee no.'
                            id='form-input-empNo'
                            size='medium'
                            value={employeeNo}
                            onChange={e => setEmployeeNo(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='First Name'
                            placeholder='first name'
                            id='form-input-first-name'
                            size='medium'
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Middle Name'
                            placeholder='middle name'
                            id='form-input-middle-name'
                            size='medium'
                            value={middleName}
                            onChange={e => setMiddleName(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Last Name'
                            placeholder='last name'
                            id='form-input-last-name'
                            size='medium'
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleCloseAddModal}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddEmployee}>
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

                <Modal.Content>Are you sure you want to Delete this User?</Modal.Content>

                <Modal.Actions>
                    <Button onClick={handleCloseDeleteModal}>
                        <Icon name='close' />Cancel
                    </Button>
                    <Button negative onClick={handleDeleteEmployee}>
                        <Icon name='trash' />Delete
                    </Button>
                </Modal.Actions>
            </Modal>

            <Modal
                size="mini"
                open={editModal}
                onClose={handleCloseEditModal}
            >
                <Modal.Header>Edit Employee</Modal.Header>
                <Modal.Content>
                    <Form>

                        <Form.Input
                            fluid
                            label='Employee No.'
                            placeholder='employee no.'
                            id='form-input-empNo'
                            size='medium'
                            value={employeeNo}
                            onChange={e => setEmployeeNo(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='First Name'
                            placeholder='first name'
                            id='form-input-first-name'
                            size='medium'
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Middle Name'
                            placeholder='middle name'
                            id='form-input-middle-name'
                            size='medium'
                            value={middleName}
                            onChange={e => setMiddleName(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Last Name'
                            placeholder='last name'
                            id='form-input-last-name'
                            size='medium'
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleCloseEditModal}>
                        Cancel
                    </Button>
                    <Button onClick={handleEditEmployee}>
                        <Icon name='save' />Submit
                    </Button>
                </Modal.Actions>
            </Modal>
        </div>
    );
}

export default Employees;
