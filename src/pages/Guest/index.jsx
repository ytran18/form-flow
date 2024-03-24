import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { fireStore } from "@core/firebase/firebase";
import { doc, getDoc } from 'firebase/firestore';

import { useAssigneePackageHook } from "@core/redux/hooks";

import { Spin } from 'antd';

import GuestHeader from "./GuestHeader";
import CommonQuestion from "./CommonQuestion";
import Assignment from "./Assignment";

const Guest = () => {

    const param = useParams();

    const [state, setState] = useState({
        form: {},
        activeTab: 0,
        isLoading: true,
    });

    const assignee = useAssigneePackageHook();

    useEffect(() => {
        if (param.formId) {
            const docRef = doc(fireStore, 'forms', param.formId);
            getDoc(docRef).then((snapshot) => {
                let form = {};
                if (snapshot.data()) form = snapshot.data();
                state.form = form;
                state.isLoading = false;
                if (Object.keys(assignee).length > 0) state.activeTab = 1;
                setState(prev => ({...prev}));
            });
        };
    },[]);

    const handleNextStep = (data) => {
        state.activeTab = 1;
        setState(prev => ({...prev}));
    };

    const renderTab = () => {
        switch(state.activeTab) {
            case 0: 
                return (
                    <CommonQuestion
                        handleNextStep={handleNextStep}
                    />
                );
            case 1: 
                return (
                    <Assignment
                        form={state.form}
                        infoQuestion={assignee}
                    />
                );
        };
    };

    return (
        <div className="w-screen h-screen overflow-y-auto gap-5 px-80 py-3 bg-[rgb(240,235,248)] flex flex-col items-center">
            <div className="w-full">
                <GuestHeader
                    form={state.form}
                />
            </div>
            {state.isLoading && (
                <div className="w-full flex items-center justify-center">
                    <Spin />
                </div>
            )}
            {!state.isLoading && (
                <div className="w-full">
                    {renderTab()}
                </div>
            )}
        </div>
    );
};

export default Guest;