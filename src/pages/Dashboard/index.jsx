import React, { useEffect, useState } from "react";

import { message, Spin, Empty } from 'antd';
import { useNavigate } from "react-router-dom";

import { useUserPackageHook } from '@core/redux/hooks';
import { formPackage } from '@core/redux/actions';
import { useDispatch } from "react-redux";
import { clear } from "@core/redux/actions";

import { v4 as uuidv4 } from 'uuid';

import { fireStore } from "@core/firebase/firebase";
import { collection, getDocs } from 'firebase/firestore';

import Header from "@components/Header";
import Card from "@components/Card";

import IconPlus from '@icon/iconPlus.svg';

const Dashboard = () => {

    const user = useUserPackageHook();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [state, setState] = useState({
        forms: [],
        isLoading: true,
        search: '',
        searchForm: [],
    });

    useEffect(() => {
        dispatch(formPackage({}))
    },[])

    const compare = (a, b) => {
        var dateA = new Date(a.mordified_at);
        var dateB = new Date(b.mordified_at);
        return dateB - dateA;
    }

    const getData = () => {
        const formDocRef = collection(fireStore, 'forms');

        getDocs(formDocRef).then((querySnapshot) => {
            let forms = [];
            querySnapshot.forEach((doc) => {
                if (doc.data()) forms.push(doc.data());
            });
            forms = forms.sort(compare);
            state.forms = forms;
            state.isLoading = false;
            setState(prev => ({...prev}));
        });
    };
    
    useEffect(() => {
        async function fetchData() {
            await getData();
        };
        fetchData();
    },[]); 

    // const labelRender = (props) => {
    //     const { label, value } = props;
    //     if (label) return value;
    // };

    // useEffect(() => {
    //     if (Object.keys(user).length === 0) {
    //         navigate({pathname:'/login'});
    //     };
    // },[user]);

    const handleLogout = () => {
        setTimeout(() => {
            dispatch(clear());
            message.success('Log out successfully');
            navigate({pathname:'/login'});
        },3000);
    };

    const handleCreateNewForm = () => {
        navigate(
            `/form/${uuidv4()}`,
            {
                state: 'new',
            }
        );
    };

    const handleNavigateForm = (event, id) => {
        const contextMenuIcons = document.querySelectorAll('[id=context-memu-icon]');
        for (let i = 0; i < contextMenuIcons.length; i++) {
            if (contextMenuIcons[i].contains(event?.target)) {
                return;
            };
        };
        const contextMenuPopover = document.getElementById('context-menu-popover');
        const modal = document.getElementsByClassName('ant-modal-wrap');
        if (contextMenuPopover?.contains(event?.target) || modal?.[0]?.contains(event?.target)) {
            return;
        };

        const selectedForm = state.forms.find(element => element._id === id);
        dispatch(formPackage(selectedForm));
        navigate(
            `/form/${selectedForm._id}`,
            {
                state: 'edit',
            }
        );
    };

    const handleSearch = (event) => {
        state.search = event?.target?.value;
        const searchForms = [...state.forms];
        let arr = [];

        searchForms.map((item) => {
            if (item?.formTitle?.toLowerCase()?.trim()?.includes(event?.target?.value?.trim().toLowerCase())) {
                arr.push(item);
            };
        });
        state.searchForm = arr;

        setState(prev => ({...prev}));
    };

    return (
        <div className="w-screen h-screen relative flex flex-col gap-10">
            <div className="h-16 min-h-16 w-full">
                <Header
                    user={user}
                    searchValue={state.search}
                    handleSearch={handleSearch}
                    handleLogout={handleLogout}
                />
            </div>
            <div className="flex-grow overflow-y-auto flex flex-col gap-3 w-full px-8 ml:px-52">
                <div className="w-full flex items-center justify-between">
                    <div className="font-semibold">Recent forms</div>
                </div>
                {state.isLoading && (
                    <div className="w-full pt-10 flex justify-center">
                        <Spin tip="Loading" size="large" />
                    </div>
                )}
                {(state.forms.length === 0 && !state.isLoading) && (
                    <div className="w-full pt-10 flex justify-center">
                        <Empty />
                    </div>
                )}
                {state.search.length === 0 ? (
                    <div className="flex flex-wrap justify-center gap-5 pb-4">
                        {state.forms.length > 0 && state.forms.map((item, index) => {
                            return (
                                <div key={`forms-${index}`}>
                                    <Card
                                        data={item}
                                        getData={getData}
                                        handleNavigateForm={handleNavigateForm}
                                    />
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-5 pb-4">
                        {state.searchForm.length > 0 && state.searchForm.map((item, index) => {
                            return (
                                <div key={`forms-${index}`}>
                                    <Card
                                        data={item}
                                        getData={getData}
                                        handleNavigateForm={handleNavigateForm}
                                    />
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            <div className="absolute bottom-4 right-8 ml:right-10">
                <div
                    style={{boxShadow: "0px 6px 10px 0px rgba(0,0,0,.14), 0px 1px 18px 0px rgba(0,0,0,.12), 0px 3px 5px -1px rgba(0,0,0,.2)"}}
                    className="bg-white w-14 h-14 flex items-center justify-center rounded-full"
                    onClick={handleCreateNewForm}
                >
                    <IconPlus className="cursor-pointer"/>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;