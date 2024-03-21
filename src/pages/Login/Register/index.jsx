import React, { useState } from "react";

// library
import { Button, Input, Checkbox, message } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import { doc, collection, setDoc } from 'firebase/firestore';
import { fireStore } from "@core/firebase";

import { isValidEmail } from "@utils/function.js";

const Register = (props) => {

    const { handleLogin } = props;

    const [state, setState] = useState({
        typePassword: 'password',
        email: '',
        password: '',
        rePassword: '',
        isValidEmail: '',
    });

    const handleEmail = (event) => {
        const isValid = isValidEmail(event?.target?.value);

        state.email = event?.target?.value;
        state.isValidEmail = isValid;
        setState(prev => ({...prev}));
    };

    const handleNavigate = async () => {
        if (!state.isValidEmail) {
            message.error('Invalid Email', 3);
            return;
        };

        if (state.password === '' || state.rePassword === '') {
            message.error('Please enter your password', 3);
            return;
        };
        
        if (state.password.length < 6) {
            message.error('Password must be at least 6 characters', 3);
            return;
        };

        if (state.password !== state.rePassword) {
            message.error('Password does not match', 3);
            return;
        };

        const rs = {
            _id: uuidv4(),
            email: state.email,
            password: state.password,
            avt_url: '',
            created_at: new Date().toLocaleString(),
        };

        try {
            const docRef = doc(collection(fireStore, 'users'), rs._id);
            await setDoc(docRef, rs);
            message.success('Register successfully, please login to continue', 3);
            handleLogin(0);
        } catch (error) {
            message.error(error);
        };

    };

    return (
        <div className="w-full flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <Input
                    value={state.email}
                    onChange={handleEmail}
                    className={`w-full !border-[rgb(236,236,236)] !outline !outline-1 h-12 ${state.isValidEmail ? '!outline-green-400' : state.email.length === 0 ? '!outline-[rgb(236,236,236)]' : '!outline-red-400'}`}as
                    placeholder="Enter your email"
                />
                <Input
                    className="w-full h-12"
                    type={state.typePassword}
                    placeholder="Enter your password"
                    value={state.password}
                    onChange={(e) => setState(prev => ({...prev, password: e.target.value}))}
                />
                <Input
                    className="w-full h-12"
                    type={state.typePassword}
                    value={state.rePassword}
                    onChange={(e) => setState(prev => ({...prev, rePassword: e.target.value}))}
                    placeholder="Re-enter your password"
                />
                <Checkbox
                    onChange={(e) => setState(prev => ({...prev, typePassword: e.target.checked ? 'text' : 'password'}))}
                >
                    Show password
                </Checkbox>
            </div>
            <div className="flex justify-end gap-3">
                <Button
                    onClick={() => handleLogin(0)}
                >
                    Go back
                </Button>
                <Button
                    className="bg-[#1677ff]"
                    type="primary"
                    onClick={handleNavigate}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Register;