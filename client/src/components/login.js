import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, Form, Icon, Popup, Image } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import UserContext from './context/userContext';
const axios = require('axios');

const Login = (props) => {
    const { setUserData } = useContext(UserContext);
    const [name, setName] = useState("");
    const [resgisterUserName, setRegisterUserName] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [errSignInMsg, setErrSignInMsg] = useState("");
    const [errRegisterMsg, setErrRegisterMsg] = useState("");
    const [signInLoader, setSignInLoader] = useState(false);
    const [registerLoader, setRegisterLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onLogin = async () => {
        setSignInLoader(true);
        const url = window.apihost + "login";
        const loginUser = {
            "userName": userName,
            "password": password
        }
        await axios.post(url, loginUser)
            .then(function (response) {
                // handle success
                sessionStorage.setItem("auth-token", response.data.token);
                sessionStorage.setItem("userData", JSON.stringify(response.data));
                sessionStorage.setItem("user", JSON.stringify(response.data.user));
                setUserData(response.data);
                setSignInLoader(false);
            })
            .catch(err => {
                const errors = {
                    msg: err.response.data.message,
                    status: err.response.status
                }
                setErrSignInMsg(err.response.data.message);
                setSignInLoader(false);
            });
    }

    const handleSignInUserName = (e) => {
        setUserName(e.target.value);
        setErrSignInMsg("");
    }

    const handleSignInPassword = (e) => {
        setPassword(e.target.value);
        setErrSignInMsg("");
    }

    const onRegister = () => {
        setRegisterLoader(true);
        const url = window.apihost + "registration";
        const newUser = {
            "name": name,
            "userName": resgisterUserName,
            "password": registerPassword,
            // "passwordCheck": passwordCheck
        };
        axios.post(url, newUser)
            .then(function (response) {
                // handle success
                alert("Successfully Registered " + response.data);
                setRegisterLoader(false);
            })
            .catch(err => {
                const errors = {
                    msg: err.response.data,
                    status: err.response.status
                }
                setErrRegisterMsg(err.response.data);
                setRegisterLoader(false);
            });
    }

    const handleName = (e) => {
        setName(e.target.value);
        setErrRegisterMsg("");
    }

    const handleRegisterUserName = (e) => {
        setRegisterUserName(e.target.value);
        setErrRegisterMsg("");
    }

    const handleRegisterPassword = (e) => {
        setRegisterPassword(e.target.value);
        setErrRegisterMsg("");
    }

    const handlePasswordChecker = (e) => {
        setPasswordCheck(e.target.value);
        setErrRegisterMsg("");
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div style={{
            height: '100vh',
            width: '100%',
            fontFamily: `'Montserrat', sans-serif`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            background: '#F3F1F1',
        }}>
            <Card link style={{ margin: '0 auto', width: '30%' }}>
                {/* <h1 style={{ textAlign: 'center', marginTop: 10, marginBottom: 10 }}>Logo</h1> */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                    <Image src="unimore-logo-landscape.png" size='large' style={{ backgroundColor: 'white' }} />
                </div>
                <h6 style={{ textAlign: 'center', marginTop: 10, marginBottom: 5, color: 'red' }}>{errSignInMsg}</h6>
                <div style={{ paddingLeft: 30, paddingRight: 30, }}>
                    <Form>
                        <Form.Input
                            fluid
                            label='Username'
                            placeholder='username'
                            id='form-input-first-name'
                            size='large '
                            value={userName}
                            onChange={handleSignInUserName}
                        />
                        <Form.Input
                            fluid
                            label='Password'
                            placeholder='password'
                            type='password'
                            size='large'
                            value={password}
                            onChange={handleSignInPassword}
                        />

                        <div>
                            <div style={{ margin: '0 auto', marginTop: 10, display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                                <Button
                                    size='large'
                                    variant='contained'
                                    style={{ backgroundColor: '#1e88e5', color: '#fff', borderRadius: 20, width: '130px', height: '50px' }}
                                    disabled={signInLoader}
                                    onClick={onLogin}
                                    type='submit'
                                >
                                    {signInLoader === false ? "Sign In" : <Icon loading name='spinner' />}
                                </Button>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
                                {/* <a href='#'><b>Forgot Password?</b></a> */}
                                <Popup
                                    content='Contact admin to change your password.'
                                    on='click'
                                    pinned
                                    trigger={<a href='#'><b>Forgot Password?</b></a>}
                                />
                            </div>
                        </div>
                    </Form>
                </div>
            </Card>
        </div >
    );
}

export default Login;