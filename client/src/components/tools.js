import React, { useState, useEffect } from 'react'
import { Modal, Button, Card, Icon, Form, Pagination, Popup, Table } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

//import pdfmake
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const axios = require("axios");

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

const Tools = () => {
    const [toolsData, setToolsData] = useState(null);
    const [selectedTools, setSelectedTools] = useState([]);
    const [loader, setLoader] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    const [id, setId] = useState(-1);
    const [serialNo, setSerialNo] = useState("");
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [datePurchased, setDatePurchased] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState([]);
    const [brandFilter, setBrandFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [brandOptions, setBrandOptions] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [toolsOptions, setToolsOptions] = useState("");
    const [totalTools, setTotalTools] = useState(0);
    const [toolPage, setToolPage] = useState(1);
    const [popUpState, setPopUpState] = useState(false);
    const [allTools, setAllTools] = useState([]);

    const boundaryRange = 1;
    const siblingRange = 1;
    const showEllipsis = true;
    const showFirstAndLastNav = true;
    const showPreviousAndNextNav = true;

    useEffect(() => {
        var data = {
            selectedTools: !selectedTools ? [] : selectedTools,
            brandFilter: !brandFilter ? [] : brandFilter,
            categoryFilter: !categoryFilter ? [] : categoryFilter,
            statusFilter: !statusFilter ? [] : statusFilter,
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
    }, [selectedTools, loader, toolPage, brandFilter, categoryFilter, statusFilter]);

    const toolsList = toolsData
        ? toolsData.map((x) => ({
            id: x._id,
            serialNo: x.SerialNo,
            name: x.Name,
            brand: x.Brand,
            category: x.Category,
            datePurchased: x.DatePurchased,
            location: x.Location,
            description: x.Description,
            status: x.Status,
            available: x.Available
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

        var data = {
            brandFilter: !brandFilter ? [] : brandFilter,
            categoryFilter: !categoryFilter ? [] : categoryFilter,
            statusFilter: !statusFilter ? [] : statusFilter,
        };

        axios
            .post(url, data, {
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
    }, [loader, brandFilter, categoryFilter, statusFilter]);

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

    useEffect(() => {
        var route = "tools/brand-options";
        var url = window.apihost + route;
        // var token = sessionStorage.getItem("auth-token");
        axios
            .get(url)
            .then(function (response) {
                // handle success
                if (Array.isArray(response.data)) {
                    setBrandOptions(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setBrandOptions(obj);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [brandOptions, selectedBrand]);

    const brandOptionList = brandOptions
        ? brandOptions.map((x) => ({
            id: x._id,
            brand: x.brand

        }))
        : [];

    const handleAddTools = () => {
        var route = "tools/";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var data = {
            serialNo: serialNo,
            name: name,
            brand: brand,
            category: category ? category.value : "",
            datePurchased: datePurchased,
            location: location,
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
                setBrand("");
                setCategory("");
                setDatePurchased("");
                setLocation("");
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
        setBrand("");
        setCategory("");
        setDatePurchased("");
        setLocation("");
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
            Brand: brand !== "" ? brand : "No Brand",
            Category: category ? category.value : "",
            DatePurchased: datePurchased,
            Location: location,
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
                setBrand("");
                setCategory("");
                setDatePurchased("");
                setLocation("");
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
        var ctgry = params.category ? { value: params.category, label: params.category } : "";
        var sts = params.status ? { value: params.status, label: params.status } : "";
        setEditModal(true);
        setId(params.id);
        setSerialNo(params.serialNo);
        setName(params.name);
        setBrand(params.brand);
        setCategory(ctgry);
        setDatePurchased(params.datePurchased);
        setLocation(params.location);
        setDescription(params.description);
        setStatus(sts);
    }

    const handleCloseEditModal = () => {
        setEditModal(false);
        setId(-1);
        setSerialNo("");
        setName("");
        setBrand("");
        setCategory("");
        setDatePurchased("");
        setLocation("");
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
        setBrand("");
        setCategory("");
        setDatePurchased("");
        setLocation("");
        setDescription("");
        setStatus([]);
    }

    function StatusOption() {
        var list = [
            { value: "Good", label: "Good" },
            { value: "For Repair", label: "For Repair" },
            { value: "For Replacement", label: "For Replacement" },
        ];
        return list;
    }

    function CategoryOption() {
        var list = [
            { value: "Electric Tool", label: "Electric Tool" },
            { value: "Manual Tool", label: "Manual Tool" },
        ];
        return list;
    }

    function BrandOption(item) {
        var list = [];
        if (item !== undefined || item !== null) {
            item.map((x) => {
                return list.push({
                    label: x.brand !== "" ? x.brand : "No Brand",
                    value: x.brand,
                });
            });
        }
        return list;
    }

    const handleClearFilter = () => {
        setPopUpState(false);
        setBrandFilter(null);
        setCategoryFilter(null);
        setStatusFilter(null);
    }

    const exportToPDF = () => {
        var url = window.apihost + "tools/list-of-all-tools";
        var token = sessionStorage.getItem("auth-token");
        var data = [];
        axios
            .get(url, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (Array.isArray(response.data)) {
                    setAllTools(response.data);
                    const document = {
                        content: [
                            { image: 'unimore', width: 195, height: 70 },
                            {
                                columns: [
                                    [
                                        { text: "List of Tools", fontSize: 15, bold: true, lineHeight: 1 },
                                    ],
                                    [
                                        { text: "Date: " + moment().format("MMM DD, yyyy"), fontSize: 15, bold: true, lineHeight: 1, },
                                    ]
                                ]
                            },
                        ],
                        images: {
                            unimore: 'https://i.ibb.co/mTwt2jt/unimore-logo-back-black.png'
                        }
                    }
    
                    document.content.push({
                        // layout: 'lightHorizontalLines',
                        table: {
                            headerRows: 1,
                            widths: [80, 50, 78, 60, 37, 70, 70],
                            body: [
                                //Data
                                //Header
                                [
                                    { text: 'Name', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Serial No.', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Brand', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Status', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Location', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Description', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Availability', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                ],
                            ]
                        },
                    });
    
                    response.data.forEach(y => {
                        document.content.push({
                            // layout: 'lightHorizontalLines',
                            table: {
                                headerRows: 1,
                                widths: [80, 50, 78, 60, 37, 70, 70],
                                body: [
                                    //Data
                                    [
                                        { text: y.Name, fontSize: 7, alignment: "left", },
                                        { text: y.SerialNo, fontSize: 7, alignment: "left", },
                                        { text: y.Brand, fontSize: 7, alignment: "left", },
                                        { text: y.Status, fontSize: 7, alignment: "center", color: y.Status === "Good" ? "green" : "black" },
                                        { text: y.Location, fontSize: 7, alignment: "center", },
                                        { text: y.Description, fontSize: 7, alignment: "center", },
                                        { text: y.Available, fontSize: 7, alignment: "left", color: y.Available === "On Hand" ? "green" : "red" },
                                    ],
                                ],
                                // lineHeight: 2
                            },
                        });
                    });
    
                    pdfMake.tableLayouts = {
                        exampleLayout: {
                            hLineWidth: function (i, node) {
                                if (i === 0 || i === node.table.body.length) {
                                    return 0;
                                }
                                return (i === node.table.headerRows) ? 2 : 1;
                            },
                            vLineWidth: function (i) {
                                return 0;
                            },
                            hLineColor: function (i) {
                                return i === 1 ? 'black' : '#aaa';
                            },
                            paddingLeft: function (i) {
                                return i === 0 ? 0 : 8;
                            },
                            paddingRight: function (i, node) {
                                return (i === node.table.widths.length - 1) ? 0 : 8;
                            }
                        }
                    };
    
                    // pdfMake.createPdf(document).download();
                    pdfMake.createPdf(document).print({}, window.frames['printPdf']);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setAllTools(obj);
                    const document = {
                        content: [
                            { image: 'unimore', width: 195, height: 70 },
                            {
                                columns: [
                                    [
                                        { text: "List of Tools", fontSize: 15, bold: true, lineHeight: 1 },
                                    ],
                                    [
                                        { text: "Date: " + moment().format("MMM DD, yyyy"), fontSize: 15, bold: true, lineHeight: 1, },
                                    ]
                                ]
                            },
                        ],
                        images: {
                            unimore: 'https://i.ibb.co/mTwt2jt/unimore-logo-back-black.png'
                        }
                    }
    
                    document.content.push({
                        // layout: 'lightHorizontalLines',
                        table: {
                            headerRows: 1,
                            widths: [80, 50, 78, 60, 37, 70, 70],
                            body: [
                                //Data
                                //Header
                                [
                                    { text: 'Name', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Serial No.', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Brand', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Status', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Location', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Description', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Availability', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                ],
                            ]
                        },
                    });
    
                    obj.forEach(y => {
                        document.content.push({
                            // layout: 'lightHorizontalLines',
                            table: {
                                headerRows: 1,
                                widths: [80, 50, 78, 60, 37, 70, 70],
                                body: [
                                    //Data
                                    [
                                        { text: y.Name, fontSize: 7, alignment: "left", },
                                        { text: y.SerialNo, fontSize: 7, alignment: "left", },
                                        { text: y.Brand, fontSize: 7, alignment: "left", },
                                        { text: y.Status, fontSize: 7, alignment: "center", color: y.Status === "Good" ? "green" : "black" },
                                        { text: y.Location, fontSize: 7, alignment: "center", },
                                        { text: y.Description, fontSize: 7, alignment: "center", },
                                        { text: y.Available, fontSize: 7, alignment: "left", color: y.Available === "On Hand" ? "green" : "red" },
                                    ],
                                ],
                                // lineHeight: 2
                            },
                        });
                    });
    
                    pdfMake.tableLayouts = {
                        exampleLayout: {
                            hLineWidth: function (i, node) {
                                if (i === 0 || i === node.table.body.length) {
                                    return 0;
                                }
                                return (i === node.table.headerRows) ? 2 : 1;
                            },
                            vLineWidth: function (i) {
                                return 0;
                            },
                            hLineColor: function (i) {
                                return i === 1 ? 'black' : '#aaa';
                            },
                            paddingLeft: function (i) {
                                return i === 0 ? 0 : 8;
                            },
                            paddingRight: function (i, node) {
                                return (i === node.table.widths.length - 1) ? 0 : 8;
                            }
                        }
                    };
    
                    // pdfMake.createPdf(document).download();
                    pdfMake.createPdf(document).print({}, window.frames['printPdf']);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }

    return (
        <div>
            <ToastContainer />
            <Button size='large' style={{ float: 'left' }} onClick={() => setAddModal(true)}><Icon name='plus' />Add Tool</Button>

            <div style={{
                float: 'right', width: '30%', zIndex: 100, marginBottom: 30,
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
                    styles={customMultiSelectStyle}
                />
            </div>

            <Popup
                on='click'
                open={popUpState}
                onOpen={() => setPopUpState(true)}
                onClose={() => setPopUpState(false)}
                pinned
                size='huge'
                flowing
                position="bottom center"
                trigger={
                    <Button icon size='large' style={{ float: 'right' }}>
                        <Icon name='filter' />
                    </Button>
                }
            >
                <div class="ui link celled selection list" style={{ "padding": "20px", "width": "300px" }}>
                    <h2>Filter</h2>
                    <Form>
                        <label><strong>Brand</strong></label>
                        <Select
                            defaultValue={brandFilter}
                            options={BrandOption(brandOptionList)}
                            onChange={e => setBrandFilter(e)}
                            placeholder='Brand...'
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

                        <br />

                        <label><strong>Category</strong></label>
                        <Select
                            defaultValue={categoryFilter}
                            options={CategoryOption()}
                            onChange={e => setCategoryFilter(e)}
                            placeholder='Category...'
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
                        <br />

                        <label><strong>Status</strong></label>
                        <Select
                            defaultValue={statusFilter}
                            options={StatusOption()}
                            onChange={e => setStatusFilter(e)}
                            placeholder='Category...'
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
                    <div style={{ marginTop: 20, alignContent: 'center', float: 'center', display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={handleClearFilter} style={{ margin: '0 auto' }}>
                            <Icon name='close' /> Clear All
                        </Button>
                    </div>
                </div>
            </Popup>

            <Button size='large' style={{ float: 'right' }} onClick={() => exportToPDF()}><Icon name='file pdf' />Export to PDF</Button>

            <div style={{ width: "100%", overflowY: 'scroll', height: '100%', maxHeight: '78vh', }}>
                <Table celled size='large' color='blue'>
                    <Table.Header style={{ position: "sticky", top: 0 }}>
                        <Table.Row>
                            <Table.HeaderCell rowSpan='2'>Name</Table.HeaderCell>
                            <Table.HeaderCell rowSpan='2'>Serial No.</Table.HeaderCell>
                            <Table.HeaderCell rowSpan='2'>Brand</Table.HeaderCell>
                            <Table.HeaderCell rowSpan='2'>Category</Table.HeaderCell>
                            <Table.HeaderCell rowSpan='2'>Date Purchased</Table.HeaderCell>
                            <Table.HeaderCell rowSpan='2'>Status</Table.HeaderCell>
                            <Table.HeaderCell rowSpan='2'>Location</Table.HeaderCell>
                            <Table.HeaderCell rowSpan='2'>Description</Table.HeaderCell>
                            <Table.HeaderCell rowSpan='2'>Available</Table.HeaderCell>
                            <Table.HeaderCell rowSpan='2' style={{ textAlign: 'center' }}>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    {toolsList !== null && loader !== true && toolsList.map(x =>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>{x.name}</Table.Cell>
                                <Table.Cell>{x.serialNo}</Table.Cell>
                                <Table.Cell>{x.brand ? x.brand : "No Brand"}</Table.Cell>
                                <Table.Cell>{x.category}</Table.Cell>
                                <Table.Cell>{x.datePurchased ? moment(x.datePurchased).format("MM/DD/yyyy") : "No Date"}</Table.Cell>
                                <Table.Cell>
                                    {x.status === "Good" &&
                                        <a style={{ color: "green" }}>
                                            <Icon name='info circle' />
                                            {x.status}
                                        </a>
                                    }
                                    {x.status === "For Repair" &&
                                        <a style={{ color: "orange" }}>
                                            <Icon name='info circle' />
                                            {x.status}
                                        </a>
                                    }
                                    {x.status === "For Replacement" &&
                                        <a style={{ color: "red" }}>
                                            <Icon name='info circle' />
                                            {x.status}
                                        </a>
                                    }
                                </Table.Cell>
                                <Table.Cell>{x.location}</Table.Cell>
                                <Table.Cell>{x.description}</Table.Cell>
                                <Table.Cell>
                                    {x.available === "On Hand" &&
                                        <a style={{ color: "green" }}>
                                            {x.available}
                                        </a>
                                    }
                                    {x.available === "Borrowed" &&
                                        <a style={{ color: "red" }}>
                                            {x.available}
                                        </a>
                                    }
                                </Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}>
                                    <div className='ui two buttons'>
                                        <Button basic color='grey' onClick={() => handleOpenEditModal(x)}>
                                            Edit
                                        </Button>
                                        <Button basic color='grey' onClick={() => handleOpenDeletePopup(x.id)}>
                                            Delete
                                        </Button>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    )}
                </Table>

                {/*  <Card.Group itemsPerRow={4} style={{ marginTop: 40, margin: '0 auto', width: '100%', backgroundColor: '#EEEEEE', overflowY: 'scroll', height: '100%', maxHeight: '80vh', }}>
                    {toolsList !== null && loader !== true && toolsList.map(x =>
                        <Card color='blue'>
                            <Card.Content>
                                <Card.Header>{x.name}</Card.Header>
                                <Card.Meta>{x.serialNo}</Card.Meta>
                                <Card.Description>
                                    <b>Brand:</b> {x.brand ? x.brand : "No Brand"}
                                </Card.Description>
                                <Card.Description>
                                    <b>Date Purchased:</b> {x.datePurchased ? moment(x.datePurchased).format("MMMM DD, yyyy") : "No Date"}
                                </Card.Description>
                                <Card.Description>
                                    <b>Category:</b> {x.category}
                                </Card.Description>
                                <Card.Description>
                                    <b>Location:</b> {x.location}
                                </Card.Description>
                                <Card.Description>
                                    <b>Description:</b> {x.description}
                                </Card.Description>
                                <Card.Content style={{ marginTop: 10, marginBottom: 20 }}>
                                    {x.status === "Good" &&
                                        <a style={{ color: "green" }}>
                                            <Icon name='info circle' />
                                            <b>Status:</b> {x.status}
                                        </a>
                                    }
                                    {x.status === "For Repair" &&
                                        <a style={{ color: "orange" }}>
                                            <Icon name='info circle' />
                                            <b>Status:</b> {x.status}
                                        </a>
                                    }
                                    {x.status === "For Replacement" &&
                                        <a style={{ color: "red" }}>
                                            <Icon name='info circle' />
                                            <b>Status:</b> {x.status}
                                        </a>
                                    }
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
                </Card.Group> */}

                {toolsList === null || toolsList.length === 0 && loader !== true &&
                    <div style={{ textAlign: 'center', padding: 120 }}>
                        <h1 style={{ color: "#C4C4C4" }}>No data found!</h1>
                    </div>
                }
                {loader === true &&
                    <div style={{ margin: '0 auto', textAlign: 'center' }}>
                        <Icon loading name='spinner' size='huge' style={{ color: '#C4C4C4', marginTop: 50 }} />
                    </div>
                }

            </div>
            {Object.keys(selectedTools).length === 0 &&
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
            }

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
                            label='Brand'
                            placeholder='brand'
                            id='form-input-brand'
                            size='medium'
                            value={brand}
                            onChange={e => setBrand(e.target.value)}
                        />

                        <label><strong>Category</strong></label>
                        <Select
                            defaultValue={category}
                            options={CategoryOption()}
                            onChange={e => setCategory(e)}
                            placeholder='Category...'
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

                        <Form.Input
                            fluid
                            label='Location'
                            placeholder='location'
                            id='form-input-date-purchased'
                            size='medium'
                            value={location}
                            onChange={e => setLocation(e.target.value)}
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
                            label='Brand'
                            placeholder='brand'
                            id='form-input-brand'
                            size='medium'
                            value={brand}
                            onChange={e => setBrand(e.target.value)}
                        />

                        <label><strong>Category</strong></label>
                        <Select
                            defaultValue={category}
                            options={CategoryOption()}
                            onChange={e => setCategory(e)}
                            placeholder='Category...'
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

                        <Form.Input
                            fluid
                            label='Location'
                            placeholder='location'
                            id='form-input-date-purchased'
                            size='medium'
                            value={location}
                            onChange={e => setLocation(e.target.value)}
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
