import React, { useState } from "react";

// library
import { Button, Input, Checkbox, message } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import { doc, collection, setDoc, getDocs } from 'firebase/firestore';
import { fireStore, auth } from "@core/firebase/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { useDispatch } from "react-redux";
import { userPackage } from "@core/redux/actions";

import { useNavigate } from "react-router-dom";

import { isValidEmail } from "@utils/function.js";

import IconGoogle from '@icon/iconGoogle.svg';

const Register = (props) => {

    const { handleLogin } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const handleSignUpWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const currEmail = result._tokenResponse.email;
                
                // check if user exist
                const usersRef = collection(fireStore, 'users');
                getDocs(usersRef).then((querySnapshot) => {
                    let users = []
                    querySnapshot.forEach((doc) => {
                        if (doc.data()) users.push(doc.data());
                    });

                    let isExist = false;
                    users.find((user) => {
                        if (user.email === currEmail) isExist = true;
                    });

                    if (isExist) {
                        message.error('User already exist', 3);
                        handleLogin(0);
                    } else {
                        const newUser = {
                            _id: uuidv4(),
                            email: result._tokenResponse.email,
                            password: "123456",
                            avt_url: result._tokenResponse.photoUrl,
                            created_at: new Date().toLocaleString(),
                        };

                        const docRef = doc(collection(fireStore, 'users'), newUser._id);
                        dispatch(userPackage(newUser));
                        setDoc(docRef, newUser);
                        navigate({pathname:'/'})
                    };
                });
            })
            .catch((error) => {
                message.error(error.message, 3);
            });
    };

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
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
            <div className="w-full h-[1px] bg-[rgb(219,219,219)] relative">
                <div className="absolute text-sm left-1/2 -top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-1">Or</div>
            </div>
            <Button
                className="h-12 flex items-center justify-center font-semibold"
                icon={<IconGoogle />}
                onClick={handleSignUpWithGoogle}
            >
                Sign Up with Google
            </Button>
        </div>
    );
};

export default Register;