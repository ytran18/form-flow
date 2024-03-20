import React from "react";

// library
import { Input, Button } from 'antd';

// icons
import IconGoogle from '@icon/iconGoogle.svg';

const SignIn = (props) => {

    const { handleLogin } = props;

    return (
        <div className="w-full flex flex-col gap-8">
            <Input
                className="w-full h-12"
                placeholder="Email"
            />
            <div className="w-full flex justify-end items-center gap-3">
                <Button
                    onClick={() => handleLogin(2)}
                >
                    Create Account
                </Button>
                <Button
                    className="bg-[#1677ff]"
                    type="primary"
                    onClick={() => handleLogin(1)}
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