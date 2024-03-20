import React, { useState } from "react";

// library
import { Button, Input, Checkbox } from 'antd';

const Register = (props) => {

    const { handleLogin } = props;

    const [state, setState] = useState({
        typePassword: 'password'
    });

    return (
        <div className="w-full flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <Input
                    className="w-full h-12"
                    type={state.typePassword}
                    placeholder="Enter your password"
                />
                <Input
                    className="w-full h-12"
                    type={state.typePassword}
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
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Register;