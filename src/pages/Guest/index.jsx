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
import { logErrorToFirestore } from "@utils/function";

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
        const fetchData = async () => {
            try {
                const activeDoc = await getDoc(doc(fireStore, 'active_form', 'data'));
                if (!activeDoc.exists()) return;
    
                const link = activeDoc.data().active;
                if (!link || typeof link !== 'string') return;
    
                const splitId = link.split('/').pop();
                if (!splitId) return;
    
                navigate({ pathname: `/guest/${splitId}` });
    
                const formDoc = await getDoc(doc(fireStore, 'forms', splitId));
                if (!formDoc.exists()) return;
    
                const form = formDoc.data();
                const filterShowQuestions = form.questions?.filter(q => !q.isHide) || [];

                setState(prev => ({
                    ...prev,
                    form: { ...form, questions: filterShowQuestions },
                    isAvailable: form.isAvailable,
                    isLoading: false,
                }));
            } catch (error) {
                console.error('Lỗi khi truy xuất dữ liệu từ Firestore:', error);
            }
        };
    
        fetchData();
    }, [navigate]);

    const assignee = useAssigneePackageHook();

    const handleNextStep = async (data) => {
        try {
            state.activeTab = 1;
            setState(prev => ({...prev}));
        } catch (error) {
            const messgae = `Lỗi khi tiếp tục vào trả lời câu hỏi: ${error}`;
            await logErrorToFirestore(messgae);
        }
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