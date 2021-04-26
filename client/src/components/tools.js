import React, { useState, useEffect } from 'react'
import { Modal, Button, Card, Icon, Form, Pagination } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

const Tools = () => {
    const [toolsData, setToolsData] = useState(null);
    const [selectedTools, setSelectedTools] = useState(null);
    const [loader, setLoader] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    const [id, setId] = useState(-1);
    const [serialNo, setSerialNo] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState([]);
    const [toolsOptions, setToolsOptions] = useState("");
    const [totalTools, setTotalTools] = useState(0);
    const [toolPage, setToolPage] = useState(1);

    const boundaryRange = 1;
    const siblingRange = 1;
    const showEllipsis = true;
    const showFirstAndLastNav = true;
    const showPreviousAndNextNav = true;

    useEffect(() => {
        var data = {
            selectedTools: !selectedTools ? [] : selectedTools,
            page: toolPage
        };
        var route = "tools/list";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        axios
            .post(url, data, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (Array.isArray(response.data)) {
                    setToolsData(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setToolsData(obj);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [selectedTools, loader, toolPage]);

    const toolsList = toolsData
        ? toolsData.map((x) => ({
            id: x._id,
            serialNo: x.SerialNo,
            name: x.Name,
            description: x.Description,
            status: x.Status,
        }))
        : [];

    useEffect(() => {
        var route = "tools/total-tools";
        var url = window.apihost + route;
        // var token = sessionStorage.getItem("auth-token");
        axios
            .get(url)
            .then(function (response) {
                // handle success
                var total = response.data !== "" ? response.data : 0;
                setTotalTools(total);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [toolsOptions, selectedTools, loader]);

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
                    setToolsOptions(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setToolsOptions(obj);
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

    const toolsOptionsList = toolsOptions
        ? toolsOptions.map((x) => ({
            id: x._id,
            name: x.Name,
            sn: x.SerialNo
        }))
        : [];

    function ToolsOption(item) {
        var list = [];
        if (item !== undefined || item !== null) {
            item.map((x) => {
                return list.push({
                    label: x.name + " | " + x.sn,
                    value: x.id,
                });
            });
        }
        return list;
    }

    const handleAddTools = () => {
        var route = "tools/";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var data = {
            serialNo: serialNo,
            name: name,
            description: description,
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
                toast.success(response.data.tool + ' successfully saved.', {
                    position: "top-center"
                });
                setAddModal(false);
                setLoader(false);
                setId(-1);
                setSerialNo("");
                setName("");
                setDescription("");
                setStatus([]);
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
        setSerialNo("");
        setName("");
        setDescription("");
        setStatus([]);
    }

    const handleEditTools = () => {
        var route = `tools/${id}`;
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var data = {
            SerialNo: serialNo,
            Name: name,
            Description: description,
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
                toast.success(response.data.tool + ' successfully edited.', {
                    position: "top-center"
                });
                setEditModal(false);
                setLoader(false);
                setId(-1);
                setSerialNo("");
                setName("");
                setDescription("");
                setStatus([]);
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

    const handleOpenEditModal = (params) => {
        var sts = params.status ? { value: params.status, label: params.status } : "";
        setEditModal(true);
        setId(params.id);
        setSerialNo(params.serialNo);
        setName(params.name);
        setDescription(params.description);
        setStatus(sts);
    }

    const handleCloseEditModal = () => {
        setEditModal(false);
        setId(-1);
        setSerialNo("");
        setName("");
        setDescription("");
        setStatus([]);
    }

    const handleDeleteEmployee = () => {
        var url = window.apihost + `tools/${id}`;
        var token = sessionStorage.getItem("auth-token");
        setLoader(true);
        axios
            .delete(url, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (response.status <= 200) {
                    toast.success('Tool successfully deleted!', {
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
                    toast.error(err.response.data, {
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

    const handleCloseDeleteModal = () => {
        setDeletePopup(false);
        setId(-1);
        setSerialNo("");
        setName("");
        setDescription("");
        setStatus([]);
    }

    function StatusOption() {
        var list = [
            { value: "Good", label: "Good" },
            { value: "For Repair", label: "For Repair" },
            { value: "Damaged", label: "Damaged" },
        ];
        return list;
    }

    return (
        <div>
            <ToastContainer />
            <Button size='large' style={{ float: 'left' }} onClick={() => setAddModal(true)}><Icon name='plus' />Add Tool</Button>

            <div style={{
                float: 'right', width: '30%', zIndex: 100,
            }}>
                <Select
                    defaultValue={selectedTools}
                    options={ToolsOption(toolsOptionsList)}
                    onChange={e => setSelectedTools(e)}
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
                <Card.Group itemsPerRow={3} style={{ marginTop: 40, margin: '0 auto', width: '100%', backgroundColor: '#EEEEEE', overflowY: 'scroll', height: '100%', maxHeight: '80vh', }}>
                    {toolsList !== null && loader !== true && toolsList.map(x =>
                        <Card color='blue'>
                            <Card.Content>
                                <Card.Header>{x.name}</Card.Header>
                                <Card.Meta>{x.serialNo}</Card.Meta>
                                <Card.Description>
                                    <b>Description:</b> {x.description}
                                </Card.Description>
                                <Card.Content style={{ marginTop: 10, marginBottom: 20 }}>
                                    <a>
                                        <Icon name='info circle' />
                                        <b>Status:</b> {x.status}
                                    </a>
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
                            </Card.Content>
                        </Card>
                    )}
                </Card.Group>

                {toolsList === null || toolsList.length === 0 || loader !== true &&
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
                    activePage={toolPage}
                    boundaryRange={boundaryRange}
                    onPageChange={(e, { activePage }) => setToolPage(activePage)}
                    size='mini'
                    siblingRange={siblingRange}
                    totalPages={totalTools / 12}
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
                <Modal.Header>Add New Tool</Modal.Header>
                <Modal.Content>
                    <Form>

                        <Form.Input
                            fluid
                            label='Serial No'
                            placeholder='serial no.'
                            id='form-input-serialNo'
                            size='medium'
                            value={serialNo}
                            onChange={e => setSerialNo(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Name'
                            placeholder='name'
                            id='form-input-name'
                            size='medium'
                            value={name}
                            onChange={e => setName(e.target.value)}
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

                        {/* <Form.Input
                            fluid
                            label='Status'
                            placeholder='status'
                            id='form-input-last-name'
                            size='medium'
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                        /> */}

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
                    <Button onClick={handleAddTools}>
                        <Icon name='save' />Submit
                    </Button>
                </Modal.Actions>
            </Modal>

            <Modal
                size="mini"
                open={editModal}
                onClose={handleCloseEditModal}
            >
                <Modal.Header>Edit Tool</Modal.Header>
                <Modal.Content>
                    <Form>

                        <Form.Input
                            fluid
                            label='Serial No'
                            placeholder='serial no.'
                            id='form-input-serialNo'
                            size='medium'
                            value={serialNo}
                            onChange={e => setSerialNo(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Name'
                            placeholder='name'
                            id='form-input-name'
                            size='medium'
                            value={name}
                            onChange={e => setName(e.target.value)}
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

                        {/* <Form.Input
                            fluid
                            label='Status'
                            placeholder='status'
                            id='form-input-last-name'
                            size='medium'
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                        /> */}

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
                    <Button onClick={handleEditTools}>
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

                <Modal.Content>Are you sure you want to Delete this Tool?</Modal.Content>

                <Modal.Actions>
                    <Button onClick={handleCloseDeleteModal}>
                        <Icon name='close' />Cancel
                    </Button>
                    <Button negative onClick={handleDeleteEmployee}>
                        <Icon name='trash' />Delete
                    </Button>
                </Modal.Actions>
            </Modal>
        </div>
    );
}

export default Tools;
