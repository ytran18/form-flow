import React, { useEffect, useState } from "react";

import { fireStore } from "@core/firebase/firebase";
import { doc, getDoc } from 'firebase/firestore';

import { useAssigneePackageHook } from "@core/redux/hooks";
import { useDispatch } from "react-redux";
import { assigneePackage } from "@core/redux/actions";

import { useNavigate } from "react-router-dom";

import { Spin } from 'antd';

import GuestHeader from "./GuestHeader";
import CommonQuestion from "./CommonQuestion";
import Assignment from "./Assignment";
import End from "./End";
import NotAvailable from "./NotAvailable";

const Guest = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [state, setState] = useState({
        form: {},
        activeTab: 0,
        isLoading: true,
        isAvailable: true,
    });

    useEffect(() => {
        async function getActiveFormLink() {
            try {
                const docRef = doc(fireStore, 'active_form', 'data');
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    const link = snapshot.data()?.active;
                    if (link && typeof link === 'string') {
                        const splitId = link.split('/').pop();
                        navigate({pathname: `/guest/${splitId}`})
                        if (splitId) {
                            const docRef = doc(fireStore, 'forms', splitId);
                            getDoc(docRef).then((snapshot) => {
                                let form = {};
                                if (snapshot?.data()) form = snapshot?.data();
                                const filterShowQuestions = [...form?.questions]?.filter(item => item?.isHide === false);
                                console.log(filterShowQuestions);
                                state.form = {
                                    ...form,
                                    questions: filterShowQuestions,
                                };
                                state.isAvailable = form?.isAvailable;
                                state.isLoading = false;
                                setState(prev => ({...prev}));
                            });
                        };
                    }
                }
            } catch (error) {
                console.error('Lỗi khi truy xuất dữ liệu từ Firestore:', error);
            }
        };
    
        getActiveFormLink();
    
    }, []);

    const assignee = useAssigneePackageHook();

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