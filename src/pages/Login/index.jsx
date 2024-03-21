import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { message } from "antd";

import { useUserPackageHook } from "@core/redux/hooks";

// components
import SignIn from "./SignIn";
import Password from "./Password";
import Register from "./Register";

const Login =  () => {

    const [state, setState] = useState({
        tab: 0,
        emailLogin: '',
    });

    const navigate = useNavigate();
    const user = useUserPackageHook();

    useEffect(() => {
        if (user) navigate({pathname:'/'})
    },[user]);

    const handleLogin = (tab, email) => {
        if (tab !== 3) {
            state.tab = tab;
            state.emailLogin = email;
            setState(prev => ({...prev}));
            return;
        };

        message.success('Login successfully', 3);
        navigate({pathname:'/'})   ;     
    };

    const renderPage = () => {
        switch(state.tab) {
            case 0: 
                return (
                    <SignIn
                        handleLogin={handleLogin}
                    />
                );
            case 1: 
                return (
                    <Password
                        handleLogin={handleLogin}
                        email={state.emailLogin}
                    />
                );
            case 2:
                return (
                    <Register
                        handleLogin={handleLogin}
                    />
                )
        };
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-[rgb(240,244,250)]">
            <div className="bg-white gap-5 w-11/12 ml:w-2/3 h-1/2 rounded-2xl p-8 flex flex-col ml:flex-row items-center">
                <div className="flex flex-col gap-3 ml:w-1/2 items-center ml:items-start">
                    <div className="text-3xl font-semibold">Sign in</div>
                    <div className="">to continue to Forms</div>
                </div>
                <div className="w-full">
                    {renderPage()}
                </div>
            </div>
        </div>
    );
};

export default Login;