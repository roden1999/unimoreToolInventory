import React, { useState, useEffect, useContext } from 'react'
import { Menu, Grid, Segment, Icon, Table, Button, Pagination, Modal, Form } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Select from 'react-select';

//Components
import UserContext from './context/userContext';

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

const MachineSpareParts = () => {
    const { userData, setUserData } = useContext(UserContext);
    const [spFilter, setSpFilter] = useState("");
    const [loader, setLoader] = useState(false);
    const [spData, setSpData] = useState(null);
    const [selectedSp, setSelectedSp] = useState([]);
    const [spOptions, setSpOptions] = useState([]);
    const [id, setId] = useState(-1);
    const [name, setName] = useState("");
    const [machine, setMachine] = useState("");
    const [description, setDescription] = useState("");
    const [remarks, setRemarks] = useState("");
    const [status, setStatus] = useState("");
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [totalSp, setTotalSp] = useState(0);
    const [page, setPage] = useState(1);

    const boundaryRange = 1;
    const siblingRange = 1;
    const showEllipsis = true;
    const showFirstAndLastNav = true;
    const showPreviousAndNextNav = true;

    useEffect(() => {
        var data = {
            selectedSp: !selectedSp ? [] : selectedSp,
            page: page,
            machine: machine
        };
        var route = "spareParts/list";
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
                    setSpData(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setSpData(obj);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [selectedSp, loader, machine, page]);

    const spList = spData
        ? spData.map((x) => ({
            id: x._id,
            name: x.Name,
            machine: x.Machine,
            description: x.Description,
            remarks: x.Remarks,
            status: x.Status
        }))
        : [];

    useEffect(() => {
        var route = "spareParts/search-options";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var data = {
            machine: machine
        }

        axios
            .post(url, data, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (Array.isArray(response.data)) {
                    setSpOptions(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setSpOptions(obj);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [loader, machine]);

    const spOptionsList = spOptions
        ? spOptions.map((x) => ({
            id: x._id,
            name: x.Name + " | " + x.Status,
        }))
        : [];

    function SPOption(item) {
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
        var route = "spareParts/sp-tools";
        var url = window.apihost + route;
        // var token = sessionStorage.getItem("auth-token");

        var data = {
            machine: machine
        }
        axios
            .post(url, data)
            .then(function (response) {
                // handle success
                var total = response.data !== "" ? response.data : 0;
                setTotalSp(total);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [spOptions, selectedSp, loader, machine]);

    const handleSpPage = (value) => {
        setSpFilter(value);
        setMachine(value);
    }

    const handleAddSP = () => {
        var route = "spareParts/";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var data = {
            name: name,
            machine: machine,
            description: description,
            remarks: remarks,
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
                toast.success(response.data.sp + ' successfully saved.', {
                    position: "top-center"
                });
                setAddModal(false);
                setLoader(false);
                setId(-1);
                setName("");
                // setMachine("");
                setDescription("");
                setRemarks("");
                setStatus("");
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
        setLoader(false);
        setId(-1);
        setName("");
        // setMachine("");
        setDescription("");
        setRemarks("");
        setStatus("");
    }

    const openEditModal = (params) => {
        var st = params.status !== "" ? { label: params.status, value: params.status } : "";
        setEditModal(true);
        setId(params.id);
        setName(params.name);
        setDescription(params.description);
        setRemarks(params.remarks);
        setStatus(st);
    }

    const handleEditSP = () => {
        var route = `spareParts/${id}`;
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var data = {
            Name: name,
            // machine: machine,
            Description: description,
            Remarks: remarks,
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
                toast.success(response.data.sp + ' successfully edited.', {
                    position: "top-center"
                });
                setEditModal(false);
                setLoader(false);
                setId(-1);
                setName("");
                // setMachine("");
                setDescription("");
                setRemarks("");
                setStatus("");
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

    const handleCloseEditModal = () => {
        setEditModal(false);
        setLoader(false);
        setId(-1);
        setName("");
        // setMachine("");
        setDescription("");
        setRemarks("");
        setStatus("");
    }

    const handleDeleteItem = () => {
        var url = window.apihost + `spareParts/${id}`;
        var token = sessionStorage.getItem("auth-token");
        setLoader(true);
        axios
            .delete(url, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (response.status <= 200) {
                    toast.success('Item successfully deleted.', {
                        position: "top-center"
                    })
                    setId(-1);
                    setLoader(false);
                    setDeleteModal(false);
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

    const handleOpenDeleteModal = (id) => {
        setDeleteModal(true);
        setId(id);
    }

    const handleCloseDeleteModal = () => {
        setDeleteModal(false);
        setLoader(false);
        setId(-1);
        setName("");
        // setMachine("");
        setDescription("");
        setRemarks("");
        setStatus("");
    }

    function StatusOption() {
        var list = [
            { value: "Available", label: "Available" },
            { value: "Not Available", label: "Not Available" },
        ];
        return list;
    }

    return (
        <Grid style={{ width: '100%', }}>
            <Grid.Column width={3} style={{ height: '100%', }}>
                <Menu fluid vertical size='massive' style={{ height: '100%', minHeight: '92vh', maxHeight: '92vh' }}>

                    <Menu.Item
                        color="blue"
                    >
                        <h4 style={{ textAlign: 'center' }}><Icon color='white' name='microchip' /> MACHINES  <Icon color='white' name='microchip' /></h4>
                    </Menu.Item>

                    <div style={{ overflowY: 'scroll', height: '100%', minHeight: '86vh', maxHeight: '86vh' }}>
                        <Menu.Item
                            active={spFilter === 'WEBDECK'}
                            onClick={() => handleSpPage("WEBDECK")}
                            color="blue"
                        >
                            <h4>WEBDECK</h4>
                        </Menu.Item>

                        <Menu.Item
                            active={spFilter === 'FLATDECK'}
                            onClick={() => handleSpPage("FLATDECK")}
                            color="blue"
                        >
                            <h4>FLATDECK</h4>
                        </Menu.Item>

                        <Menu.Item
                            active={spFilter === 'RIBTYPE'}
                            onClick={() => handleSpPage("RIBTYPE")}
                            color="blue"
                        >
                            <h4>RIBTYPE</h4>
                        </Menu.Item>

                        <Menu.Item
                            active={spFilter === 'CORRUGATED'}
                            onClick={() => handleSpPage("CORRUGATED")}
                            color="blue"
                        >
                            <h4>CORRUGATED</h4>
                        </Menu.Item>

                        <Menu.Item
                            active={spFilter === 'TILE SPAN'}
                            onClick={() => handleSpPage("TILE SPAN")}
                            color="blue"
                        >
                            <h4>TILE SPAN</h4>
                        </Menu.Item>

                        <Menu.Item
                            active={spFilter === 'SLIT & SHEAR'}
                            onClick={() => handleSpPage("SLIT & SHEAR")}
                            color="blue"
                        >
                            <h4>SLIT & SHEAR</h4>
                        </Menu.Item>

                        <Menu.Item
                            active={spFilter === 'SHEARLINE'}
                            onClick={() => handleSpPage("SHEARLINE")}
                            color="blue"
                        >
                            <h4>SHEARLINE</h4>
                        </Menu.Item>

                        <Menu.Item
                            active={spFilter === 'CZ'}
                            onClick={() => handleSpPage("CZ")}
                            color="blue"
                        >
                            <h4>CZ</h4>
                        </Menu.Item>

                        <Menu.Item
                            active={spFilter === 'BEAM STUD'}
                            onClick={() => handleSpPage("BEAM STUD")}
                            color="blue"
                        >
                            <h4>BEAM STUD</h4>
                        </Menu.Item>

                        <Menu.Item
                            active={spFilter === 'BEAM BOX'}
                            onClick={() => handleSpPage("BEAM BOX")}
                            color="blue"
                        >
                            <h4>BEAM BOX</h4>
                        </Menu.Item>

                        <Menu.Item
                            active={spFilter === 'C CHANNEL'}
                            onClick={() => handleSpPage("C CHANNEL")}
                            color="blue"
                        >
                            <h4>C CHANNEL</h4>
                        </Menu.Item>

                        <Menu.Item
                            active={spFilter === 'STUD & TRACKS'}
                            onClick={() => handleSpPage("STUD & TRACKS")}
                            color="blue"
                        >
                            <h4>STUD & TRACKS</h4>
                        </Menu.Item>

                        <Menu.Item
                            active={spFilter === 'WALL ANGLE'}
                            onClick={() => handleSpPage("WALL ANGLE")}
                            color="blue"
                        >
                            <h4>WALL ANGLE</h4>
                        </Menu.Item>

                        <Menu.Item
                            active={spFilter === 'SPANDREL'}
                            onClick={() => handleSpPage("SPANDREL")}
                            color="blue"
                        >
                            <h4>SPANDREL</h4>
                        </Menu.Item>

                        <Menu.Item
                            active={spFilter === 'HAT TYPE'}
                            onClick={() => handleSpPage("HAT TYPE")}
                            color="blue"
                        >
                            <h4>HAT TYPE</h4>
                        </Menu.Item>

                        <Menu.Item
                            active={spFilter === 'SLITTER'}
                            onClick={() => handleSpPage("SLITTER")}
                            color="blue"
                        >
                            <h4>SLITTER</h4>
                        </Menu.Item>

                        <Menu.Item
                            active={spFilter === 'OVERHEAD'}
                            onClick={() => handleSpPage("OVERHEAD")}
                            color="blue"
                        >
                            <h4>OVERHEAD</h4>
                        </Menu.Item>
                    </div>
                </Menu>
            </Grid.Column>

            <Grid.Column stretched width={13}>
                <Segment style={{ marginTop: 20, height: '100%', minHeight: '90vh', maxHeight: '90vh' }}>
                    {spFilter === "" &&
                        <h1 style={{ textAlign: 'center', marginTop: '30%', color: '#C4C4C4' }}>Select Machine to View Spare Parts</h1>
                    }
                    {spFilter !== "" && loader !== true &&
                        <div style={{ marginBottom: 40 }}>
                            <h1>{spFilter + " SPARE PARTS"}</h1>
                            <Button size="large" style={{ float: 'left' }} onClick={() => setAddModal(true)}><Icon name='plus' />Add Spare Part</Button>

                            <div style={{
                                float: 'right', width: '30%', zIndex: 100,
                            }}>
                                <Select
                                    defaultValue={selectedSp}
                                    options={SPOption(spOptionsList)}
                                    onChange={e => setSelectedSp(e)}
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
                    }
                    {spFilter !== "" && loader !== true &&
                        <div>

                            <ToastContainer />

                            <div style={{ height: '100%', minHeight: '70vh', maxHeight: '70vh', overflowY: 'scroll', marginTop: 70 }}>
                                <Table celled size='large'>
                                    {<Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Name</Table.HeaderCell>
                                            <Table.HeaderCell>Description</Table.HeaderCell>
                                            <Table.HeaderCell>Remarks</Table.HeaderCell>
                                            <Table.HeaderCell>Status</Table.HeaderCell>
                                            <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>}

                                    <Table.Body>
                                        {spList !== null && loader !== true && spList.map(x =>
                                            <Table.Row>
                                                <Table.Cell>{x.name}</Table.Cell>
                                                <Table.Cell>{x.description}</Table.Cell>
                                                <Table.Cell>{x.remarks}</Table.Cell>
                                                <Table.Cell
                                                    positive={x.status === "Available" ? true : false}
                                                    negative={x.status === "Not Available" ? true : false}
                                                >
                                                    {x.status === "Available" ?
                                                        <Icon name='check' /> :
                                                        <Icon name='close' />
                                                    }

                                                    {x.status}
                                                </Table.Cell>

                                                <Table.Cell textAlign="center">
                                                    <Button.Group>
                                                        <Button basic color='grey' onClick={() => openEditModal(x)}>
                                                            Edit
                                                        </Button>
                                                        <Button basic color='grey' onClick={() => handleOpenDeleteModal(x.id)}>
                                                            Delete
                                                        </Button>
                                                    </Button.Group>
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                    </Table.Body>
                                </Table>
                                {spList === null || spList.length === 0 && loader !== true &&
                                    <h1 style={{ textAlign: 'center', marginTop: '20%', color: '#C4C4C4' }}>No Item Found!</h1>
                                }
                            </div>

                            <Pagination
                                activePage={page}
                                boundaryRange={boundaryRange}
                                onPageChange={(e, { activePage }) => setPage(activePage)}
                                size='mini'
                                siblingRange={siblingRange}
                                totalPages={totalSp / 10}
                                // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
                                ellipsisItem={showEllipsis ? undefined : null}
                                firstItem={showFirstAndLastNav ? undefined : null}
                                lastItem={showFirstAndLastNav ? undefined : null}
                                prevItem={showPreviousAndNextNav ? undefined : null}
                                nextItem={showPreviousAndNextNav ? undefined : null}
                                style={{ float: 'right', marginTop: 20 }}
                            />
                        </div>
                    }

                    {loader === true &&
                        <div style={{ margin: '0 auto', textAlign: 'center' }}>
                            <Icon loading name='spinner' size='huge' style={{ color: '#C4C4C4', marginTop: 50 }} />
                        </div>
                    }
                </Segment>
            </Grid.Column>

            <Modal
                size="mini"
                open={addModal}
                onClose={handleCloseAddModal}
            >
                <Modal.Header>Add New Spare Part</Modal.Header>
                <Modal.Content>
                    <Form>

                        <Form.Input
                            fluid
                            label='Name'
                            placeholder='name'
                            id='form-input-name'
                            size='medium'
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />

                        {/* <Form.Input
                            fluid
                            label='Machine'
                            placeholder='machine'
                            id='form-input-machine'
                            size='medium'
                            value={machine}
                            onChange={e => setMachine(e.target.value)}
                        /> */}

                        <Form.Input
                            fluid
                            label='Description'
                            placeholder='description'
                            id='form-input-description'
                            size='medium'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
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

                        <label><strong>Status</strong></label>
                        <Select
                            defaultValue={status}
                            options={StatusOption()}
                            onChange={e => setStatus(e)}
                            placeholder='Status...'
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
                    <Button onClick={handleAddSP}>
                        <Icon name='save' />Submit
                    </Button>
                </Modal.Actions>
            </Modal>

            <Modal
                size="mini"
                open={editModal}
                onClose={handleCloseEditModal}
            >
                <Modal.Header>Edit Spare Part</Modal.Header>
                <Modal.Content>
                    <Form>

                        <Form.Input
                            fluid
                            label='Name'
                            placeholder='name'
                            id='form-input-name'
                            size='medium'
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />

                        {/* <Form.Input
                            fluid
                            label='Machine'
                            placeholder='machine'
                            id='form-input-machine'
                            size='medium'
                            value={machine}
                            onChange={e => setMachine(e.target.value)}
                        /> */}

                        <Form.Input
                            fluid
                            label='Description'
                            placeholder='description'
                            id='form-input-description'
                            size='medium'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
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

                        <label><strong>Status</strong></label>
                        <Select
                            defaultValue={status}
                            options={StatusOption()}
                            onChange={e => setStatus(e)}
                            placeholder='Status...'
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
                    <Button onClick={handleEditSP}>
                        <Icon name='save' />Submit
                    </Button>
                </Modal.Actions>
            </Modal>

            <Modal
                open={deleteModal}
                onClose={handleCloseDeleteModal}
                size="small"
            >
                <Modal.Header>Warning!</Modal.Header>

                <Modal.Content>Are you sure you want to Delete this Item?</Modal.Content>

                <Modal.Actions>
                    <Button onClick={handleCloseDeleteModal}>
                        <Icon name='close' />Cancel
                    </Button>
                    <Button negative onClick={handleDeleteItem}>
                        <Icon name='trash' />Delete
                    </Button>
                </Modal.Actions>
            </Modal>
        </Grid>
    );
}

export default MachineSpareParts;
