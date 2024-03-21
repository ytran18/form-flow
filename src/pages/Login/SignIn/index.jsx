import React, { useState } from "react";

// library
import { Input, Button, message } from 'antd';
import { collection, getDocs } from 'firebase/firestore';
import { fireStore } from "@core/firebase";

import { isValidEmail } from "@utils/function.js";

// icons
import IconGoogle from '@icon/iconGoogle.svg';

const SignIn = (props) => {

    const { handleLogin } = props;

    const [state, setState] = useState({
        email: '',
        isValidEmail: false,
    });

    const handleEmail = (event) => {
        const isValid = isValidEmail(event?.target?.value);

        state.email = event?.target?.value;
        state.isValidEmail = isValid;
        setState(prev => ({...prev}));
    };
    
    const handleNavigate = (type) => {
        if (!state.isValidEmail && type === 'next') {
            message.error('Invalid Email', 3);
            return;
        };

        if (type === 'create') {
            handleLogin(2);
            return;
        };

        const usersRef = collection(fireStore, 'users');
        getDocs(usersRef).then((querySnapshot) => {
            let isEmptyCollection = querySnapshot.empty;
            if (isEmptyCollection) {
                message.error('User does not exist, please create new acccount!', 3);
            } else {
                let users = []
                querySnapshot.forEach((doc) => {
                    if (doc.data()) users.push(doc.data());
                });

                let isExist = false;
                users.find((user) => {
                    if (user.email === state.email.trim()) isExist = true;
                });

                if (isExist) {
                    handleLogin(1, state.email.trim());
                } else {
                    message.error('User does not exist, please create new acccount!', 3);
                };
            };
        });

    };

    return (
        <div className="w-full flex flex-col gap-8">
            <Input
                className={`w-full !border-[rgb(236,236,236)] !outline !outline-1 h-12 ${state.isValidEmail ? '!outline-green-400' : state.email.length === 0 ? '!outline-[rgb(236,236,236)]' : '!outline-red-400'}`}
                placeholder="Email"
                onChange={handleEmail}
                value={state.email}
            />
            <div className="w-full flex justify-end items-center gap-3">
                <Button
                    onClick={() => handleNavigate('create')}
                >
                    Create Account
                </Button>
                <Button
                    className="bg-[#1677ff]"
                    type="primary"
                    onClick={() => handleNavigate('next')}
                >
                    Next
                </Button>
            </div>
            <div className="w-full h-[1px] bg-[rgb(219,219,219)] relative">
                <div className="absolute text-sm left-1/2 -top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-1">Or</div>
            </div>
            <Button className="h-12 flex items-center justify-center font-semibold" icon={<IconGoogle />}>
                Login with Google
            </Button>
        </div>
    );
};

export default SignIn;