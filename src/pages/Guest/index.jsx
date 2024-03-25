import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { fireStore } from "@core/firebase/firebase";
import { doc, getDoc } from 'firebase/firestore';

import { useAssigneePackageHook } from "@core/redux/hooks";
import { useDispatch } from "react-redux";
import { assigneePackage } from "@core/redux/actions";

import { Spin } from 'antd';

import GuestHeader from "./GuestHeader";
import CommonQuestion from "./CommonQuestion";
import Assignment from "./Assignment";
import End from "./End";
import NotAvailable from "./NotAvailable";

const Guest = () => {

    const param = useParams();
    const dispatch = useDispatch();

    const [state, setState] = useState({
        form: {},
        activeTab: 0,
        isLoading: true,
        isAvailable: true,
    });

    const assignee = useAssigneePackageHook();

    useEffect(() => {
        if (param.formId) {
            const docRef = doc(fireStore, 'forms', param.formId);
            getDoc(docRef).then((snapshot) => {
                let form = {};
                if (snapshot.data()) form = snapshot.data();
                state.form = form;
                state.isAvailable = form?.isAvailable;
                state.isLoading = false;
                setState(prev => ({...prev}));
            });
        };
    },[]);

    const handleNextStep = (data) => {
        state.activeTab = 1;
        setState(prev => ({...prev}));
    };

    const handleEnd = () => {
        state.activeTab = 2;
        dispatch(assigneePackage({}));
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
                        handleEnd={handleEnd}
                    />
                );
            case 2: 
                return (
                    <End
                        form={state.form}
                    />
                );
        };
    };

    return (
        <div className="w-screen h-screen overflow-y-auto gap-5 px-8 md:px-16 ml:px-32 lg:px-48 xl:px-80 py-3 bg-[rgb(240,235,248)] flex flex-col items-center">
            {state.isAvailable ? (
                <>
                    {(state.activeTab !== 2 && state.isAvailable) && (
                        <div className="w-full">
                            <GuestHeader
                                form={state.form}
                            />
                        </div>
                    )}
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
                </>
            ) : (
                <div className="w-full">
                    <NotAvailable formTitle={state.form?.formTitle}/>
                </div>
            )}
        </div>
    );
};

export default Guest;