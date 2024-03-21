import React, { useEffect } from "react";

import { Select, message } from 'antd';
import { useNavigate } from "react-router-dom";

import { useUserPackageHook } from '@core/redux/hooks';
import { useDispatch } from "react-redux";
import { clear } from "@core/redux/actions";

import Header from "@components/Header";
import Card from "@components/Card";

import IconPlus from '@icon/iconPlus.svg';

const Dashboard = () => {

    const user = useUserPackageHook();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const options = [
        {
            label: 'Owned by anyone',
            value: 'Owned by anyone',
            key: 0,
        },
        {
            label: 'Owned by me',
            value: 'Owned by me',
            key: 1,
        },
        {
            label: 'Not owned by me',
            value: 'Not owned by me',
            key: 2,
        },
    ];

    const labelRender = (props) => {
        const { label, value } = props;
        if (label) return value;
    };

    useEffect(() => {
        if (Object.keys(user).length === 0) {
            navigate({pathname:'/login'});
        };
    },[user]);

    const handleLogout = () => {
        setTimeout(() => {
            dispatch(clear());
            message.success('Logout successfully', 3);
            navigate({pathname:'/login'});
        },3000);
    };

    return (
        <div className="w-screen h-screen relative flex flex-col gap-10">
            <div className="h-16 w-full">
                <Header
                    handleLogout={handleLogout}
                />
            </div>
            <div className="flex-grow flex flex-col gap-3 w-full px-8 ml:px-52">
                <div className="w-full flex items-center justify-between">
                    <div className="font-semibold">Recent forms</div>
                    <div className="">
                        <Select
                            labelRender={labelRender}
                            defaultValue={options[0]}
                            style={{
                                width: '100%',
                            }}
                            options={options}
                        />
                    </div>
                </div>
                <div className="">
                    <Card />
                </div>
            </div>
            <div className="absolute bottom-4 right-8 ml:right-10">
                <div
                    style={{boxShadow: "0px 6px 10px 0px rgba(0,0,0,.14), 0px 1px 18px 0px rgba(0,0,0,.12), 0px 3px 5px -1px rgba(0,0,0,.2)"}}
                    className="bg-white w-14 h-14 flex items-center justify-center rounded-full"
                >
                    <IconPlus className="cursor-pointer"/>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;