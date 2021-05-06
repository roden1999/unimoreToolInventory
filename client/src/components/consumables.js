import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Card, Icon, Pagination } from 'semantic-ui-react'
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

const Consumables = () => {
    const [consumablesData, setConsumablesData] = useState(null);
    const [consumablesOptions, setConsumablesOptions] = useState(null);
    const [selectedConsumables, setSelectedConsumables] = useState(null);
    const [loader, setLoader] = useState(false);
    const [id, setId] = useState(-1);
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [unit, setUnit] = useState([]);
    const [datePurchased, setDatePurchased] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [used, setUsed] = useState(0);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    const [totalItem, setTotalItem] = useState(0);
    const [itemPage, setItemPage] = useState(1);

    const boundaryRange = 1;
    const siblingRange = 1;
    const showEllipsis = true;
    const showFirstAndLastNav = true;
    const showPreviousAndNextNav = true;

    useEffect(() => {
        var data = {
            selectedConsumables: !selectedConsumables ? [] : selectedConsumables,
            page: itemPage
        };
        var route = "consumables/list";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        axios
            .post(url, data, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (Array.isArray(response.data)) {
                    setConsumablesData(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setConsumablesData(obj);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [selectedConsumables, loader, itemPage]);

    const consumablesList = consumablesData
        ? consumablesData.map((x) => ({
            id: x._id,
            name: x.Name,
            brand: x.Brand,
            unit: x.Unit,
            datePurchased: x.DatePurchased,
            description: x.Description,
            quantity: x.Quantity,
            used: x.Used,
        }))
        : [];

    useEffect(() => {
        var route = "consumables/total-item";
        var url = window.apihost + route;
        // var token = sessionStorage.getItem("auth-token");
        axios
            .get(url)
            .then(function (response) {
                // handle success
                var total = response.data !== "" ? response.data : 0;
                setTotalItem(total);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [consumablesOptions, selectedConsumables, loader]);

    useEffect(() => {
        var route = "consumables/search-options";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        axios
            .get(url, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (Array.isArray(response.data)) {
                    setConsumablesOptions(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setConsumablesOptions(obj);
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

    const consumablesOptionsList = consumablesOptions
        ? consumablesOptions.map((x) => ({
            id: x._id,
            name: x.Name,
        }))
        : [];

    function ConsumablesOption(item) {
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

    const handleAddConsumables = () => {
        var route = "consumables/";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var data = {
            name: name,
            brand: brand,
            unit: unit.length !== 0 ? unit.value : "",
            datePurchased: datePurchased,
            description: description,
            quantity: quantity,
            used: used
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
                toast.success(response.data.consumable + ' successfully edited.', {
                    position: "top-center"
                });
                setAddModal(false);
                setLoader(false);
                setId(-1);
                setName("");
                setBrand("");
                setUnit(null);
                setDatePurchased("");
                setDescription("");
                setQuantity(0);
                setUsed(0);
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
        setName("");
        setBrand("");
        setUnit(null);
        setDatePurchased("");
        setDescription("");
        setQuantity(0);
        setUsed(0);;
    }

    const handleEditConsumables = () => {
        var route = `consumables/${id}`;
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var data = {
            Name: name,
            Brand: brand,
            Unit: unit.length !== 0 ? unit.value : "",
            DatePurchased: datePurchased,
            Description: description,
            Quantity: quantity,
            Used: used
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
                toast.success(response.data.consumable + ' successfully edited.', {
                    position: "top-center"
                });
                setEditModal(false);
                setLoader(false);
                setId(-1);
                setName("");
                setBrand("");
                setUnit(null);
                setDatePurchased("");
                setDescription("");
                setQuantity(0);
                setUsed(0);
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
        var u = params.unit !== "" ? { label: params.unit, value: params.unit } : []
        setEditModal(true);
        setId(params.id);
        setName(params.name);
        setBrand(params.brand);
        setUnit(u);
        setDatePurchased(params.datePurchased);
        setDescription(params.description);
        setQuantity(params.quantity);
        setUsed(params.used);
    }

    const handleCloseEditModal = () => {
        setEditModal(false);
        setId(-1);
        setName("");
        setBrand("");
        setUnit(null);
        setDatePurchased("");
        setDescription("");
        setQuantity(0);
        setUsed(0);
    }

    const handleDeleteItem = () => {
        var url = window.apihost + `consumables/${id}`;
        var token = sessionStorage.getItem("auth-token");
        setLoader(true);
        axios
            .delete(url, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (response.status <= 200) {
                    alert('Tool successfuly deleted!');
                    toast.success('Item successfully deleted!', {
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
                    toast.success(err.response.data, {
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
        setName("");
        setBrand("");
        setUnit(null);
        setDatePurchased("");
        setDescription("");
        setQuantity(0);
        setUsed(0);
    }

    function UnitOption() {
        var list = [
            { value: "Pieces", label: "Pieces" },
            { value: "Box", label: "Box" },
            { value: "Sets", label: "Sets" },
            { value: "Unit", label: "Unit" },
            { value: "Meters", label: "Meters" },
            { value: "Litters", label: "Litters" },
            { value: "Package", label: "Package" },
        ];
        return list;
    }

    return (
        <div>
            <ToastContainer />
            <Button size="large" style={{ float: 'left' }} onClick={() => setAddModal(true)}><Icon name='plus' />Add Item</Button>

            <div style={{
                float: 'right', width: '30%', zIndex: 100,
            }}>
                <Select
                    defaultValue={selectedConsumables}
                    options={ConsumablesOption(consumablesOptionsList)}
                    onChange={e => setSelectedConsumables(e)}
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
                    {consumablesList !== null && loader !== true && consumablesList.map(x =>
                        <Card color='blue'>
                            <Card.Content>
                                <Card.Header>{x.name}</Card.Header>
                                <Card.Meta>Brand: {x.brand ? x.brand : "No Brand"}</Card.Meta>
                                <Card.Description>
                                    <b>Unit: </b> {x.unit}
                                </Card.Description>
                                <Card.Description>
                                    <b>Date Purchased: </b> {x.datePurchased ? moment(x.datePurchased).format("MMM DD, yyyy") : "No Date"}
                                </Card.Description>
                                <Card.Description>
                                    <b>Description: </b> {x.description ? x.description : "No Description"}
                                </Card.Description>
                                <Card.Description>
                                    <b>Used: </b> {x.used + " / " + x.quantity}
                                </Card.Description>
                                <Card.Description>
                                    <b>Total Available: </b> {(x.quantity - x.used)}
                                </Card.Description>

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

                {consumablesList === null || consumablesList.length === 0 && loader !== true &&
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
                    activePage={itemPage}
                    boundaryRange={boundaryRange}
                    onPageChange={(e, { activePage }) => setItemPage(activePage)}
                    size='mini'
                    siblingRange={siblingRange}
                    totalPages={totalItem / 12}
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
                <Modal.Header>Add New Item</Modal.Header>
                <Modal.Content>
                    <Form>

                        <Form.Input
                            fluid
                            label='Name'
                            placeholder='Name'
                            id='form-input-name'
                            size='medium'
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Brand'
                            placeholder='brand'
                            id='form-input-brand'
                            size='medium'
                            value={brand}
                            onChange={e => setBrand(e.target.value)}
                        />

                        <label><strong>Unit</strong></label>
                        <Select
                            defaultValue={unit}
                            options={UnitOption()}
                            onChange={e => setUnit(e)}
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

                        <br />

                        <label><b>Date Purchased</b></label>
                        <input
                            fluid
                            label='Date Purchased'
                            placeholder='date purchased'
                            id='form-input-date-purchased'
                            size='medium'
                            type='date'
                            value={moment(datePurchased).format("yyyy-MM-DD")}
                            onChange={e => setDatePurchased(e.target.value)}
                        />

                        <br />
                        <br />

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
                            label='Quantity'
                            placeholder='quantity'
                            id='form-input-quantity'
                            type="number"
                            size='medium'
                            min="0"
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleCloseAddModal}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddConsumables}>
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
                            label='Name'
                            placeholder='name'
                            id='form-input-name'
                            size='medium'
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Brand'
                            placeholder='brand'
                            id='form-input-brand'
                            size='medium'
                            value={brand}
                            onChange={e => setBrand(e.target.value)}
                        />

                        <label><strong>Unit</strong></label>
                        <Select
                            defaultValue={unit}
                            options={UnitOption()}
                            onChange={e => setUnit(e)}
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

                        <br />

                        <label><b>Date Purchased</b></label>
                        <input
                            fluid
                            label='Date Purchased'
                            placeholder='date purchased'
                            id='form-input-date-purchased'
                            size='medium'
                            type='date'
                            value={moment(datePurchased).format("yyyy-MM-DD")}
                            onChange={e => setDatePurchased(e.target.value)}
                        />

                        <br />
                        <br />

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
                            label='Quantity'
                            placeholder='quantity'
                            id='form-input-quantity'
                            type="number"
                            size='medium'
                            min="0"
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Used'
                            placeholder='used'
                            id='form-input-used'
                            type="number"
                            size='medium'
                            min="0"
                            value={used}
                            onChange={e => setUsed(e.target.value)}
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleCloseEditModal}>
                        Cancel
                    </Button>
                    <Button onClick={handleEditConsumables}>
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
        </div>
    );
}

export default Consumables;
