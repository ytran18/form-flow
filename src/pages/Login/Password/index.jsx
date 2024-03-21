import React, { useState } from "react";

// library
import { Button, Input, Checkbox, message } from 'antd';

import { collection, getDocs } from 'firebase/firestore';
import { fireStore } from "@core/firebase";

const Password = (props) => {

    const { handleLogin, email } = props;

    const [state, setState] = useState({
        typePassword: 'password',
        password: '',
    });

    const handleNavigate = () => {
        if (state.password === '') {
            message.error('Please enter your password', 3);
            return;
        };

        const usersRef = collection(fireStore, 'users');
        getDocs(usersRef).then((querySnapshot) => {
            let users = []
            querySnapshot.forEach((doc) => {
                if (doc.data()) users.push(doc.data());
            });

            for (let i = 0; i < users.length; i++) {
                if (users[i].email === email && users[i].password === state.password.trim()) {
                    handleLogin(3);
                    break;
                } else if (users[i].email === email && users[i].password !== state.password.trim()) {
                    message.error('Invalid password', 3);
                    break;
                };
            };
        })

    };

    return (
        <div className="w-full flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <Input
                    value={state.password}
                    onChange={(e) => setState(prev => ({...prev, password: e.target.value}))}
                    className="w-full h-12"
                    type={state.typePassword}
                    placeholder="Enter your password"
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

export default Password;