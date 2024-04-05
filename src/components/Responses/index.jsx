import React, { useEffect, useState } from "react";

import { fireStore } from "@core/firebase/firebase";
import { collection, getDocs, query, where } from 'firebase/firestore';

import { Switch, Modal } from 'antd';

import ListResponse from "./ListResponse";
import DetailResponse from "./DetailResponse";

import IconView from '@icon/iconView.svg';

const Responses = (props) => {

    const { formId, form, isAvailable, onToggleChange } = props;

    const [state, setState] = useState({
        isToggle: true,
        answers: [],
        dates: [],
        isViewModal: false,
        dateOpen: '',
        selectedUsers: [],
        selectedAssignee: [],
        detailUser: {},
        isDetailTab: false,
        detailAnswer: {},
        searchValue: [],
        searchText: '',
    });

    function unixTimeToDateString(unixTime) {
        var date = new Date(unixTime * 1000);
    
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');

        var dateString = year + '-' + month + '-' + day;
    
        return dateString;
    }

    const getData = async () => {
        let answersByDate = {};
        let answers = [];
    
        const querySnapshot = await getDocs(query(collection(fireStore, 'answers'), where('formId', '==', formId)));
    
        querySnapshot.forEach((doc) => {
            answers.push(doc.data());
            const answerData = doc.data();
            const dateKey = unixTimeToDateString(answerData.modified_at)

            if (!answersByDate[dateKey]) {
                answersByDate[dateKey] = [];
            }
            
            answersByDate[dateKey].push(answerData);
        });

        const sortedDates = Object.keys(answersByDate).sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateB - dateA;
        });
    
        const sortedAnswersByDate = {};
        sortedDates.forEach(date => {
            sortedAnswersByDate[date] = answersByDate[date];
        });

        state.answers = answers;
        state.dates = sortedAnswersByDate;
        setState(prev => ({ ...prev }));
    };

    useEffect(() => {
        getData();
    },[]);

    const unixTimeToFormattedTime = (unixTime) => {
        const date = new Date(unixTime * 1000);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? ' PM' : ' AM';
        const formattedHours = hours % 12 || 12;
        const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, '0')}${ampm}`;
        return formattedTime;
    }

    const formatName = (name) => {
        if (typeof name !== 'string') return;

        const arr = name.trim().toLowerCase().split(' ');
        const format = arr.map(item => item.charAt(0).toUpperCase() + item.slice(1));
        return format.join(' ');
    };

    const onSearch = (event) => {
        const arr = [...state.selectedAssignee];
        const searchValue = event?.target?.value?.toLowerCase();
        const results = [];
        arr.map((item) => {
            if (item?.name?.toLowerCase()?.includes(searchValue) || item?.cccd?.includes(searchValue)) {
                results.push(item);
            };
        });

        state.searchValue = results;
        state.searchText = searchValue;
        setState(prev => ({...prev}));
    };

    const handleViewItem = (date) => {
        const users = state.dates[date];
        const assignee = [];

        users.map((item) => {
            assignee.push({
                ...item?.assignee,
                name: formatName(item?.assignee?.name),
                _id: item?._id,
                modified_at: unixTimeToFormattedTime(item?.modified_at),
            });
        });

        state.selectedAssignee = assignee;
        state.selectedUsers = users;
        state.isViewModal = !state.isViewModal;
        state.dateOpen = date;
        setState(prev => ({...prev}));
    };

    const onDetailItem = (id, date) => {
        const user = state.dates[date].find(item => item?._id === id);

        const answer = user?.answers;
        let answerValue = new Array(answer?.length).fill(null);

        answer.map((item) => {
            const index = form?.questions?.findIndex(ele => ele?._id === item?.questionId);
            const type_question = item?.type_question;

            if (type_question === "choice" || type_question === 'dropdown') {
                form?.questions?.[index]?.answer?.map((ans) => {
                    if (ans?.value === item?.value && item?.label !== 'Add option') {
                        answerValue[index] = ans?.label;
                    };
                });
            };

            if (type_question === 'paragraph') {
                answerValue[index] = item.value;
            };

            if (type_question === 'multiple-choice') {
                if (!answerValue[index]) {
                    answerValue[index] = '';
                };
                for (let i = 0; i < item?.value?.length; i++) {
                    form?.questions?.[index]?.answer?.map((ans) => {
                        if (ans?.value === item?.value[i] && item?.label !== 'Add option') {
                            if (answerValue[index] === '') {
                                answerValue[index] += `${ans?.label}`;
                            } else {
                                answerValue[index] += `, ${ans?.label}`;
                            };
                        };
                    });
                };
            };
        });

        let obj = {};
        form?.questions.map((item, index) => {
            obj[`${item?.title}`] = answerValue[index];
        });

        state.detailAnswer = obj;
        state.detailUser = user;
        state.isDetailTab = true;
        setState(prev => ({...prev}));
    };

    const handleNavigateBack = () => {
        state.isDetailTab = false;
        state.detailAnswer = {};
        state.detailUser = {};

        setState(prev => ({...prev}));
    };

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="bg-white rounded-lg min-h-[136px] max-h-fit w-full border-[1px] flex flex-col gap-3">
                <div className="w-full h-[10px] bg-[rgb(103,58,183)] rounded-tl-lg rounded-tr-lg"></div>
                <div className="px-5 w-full flex items-center justify-between">
                    <div className="text-2xl">{`${state.answers?.length || 0} responses`}</div>
                    <div className="flex items-center gap-3">
                        <div className="text-xs opacity-80 font-medium">Accepting responses</div>
                        <Switch
                            className="!bg-[rgb(140,140,140)]"
                            checked={isAvailable}
                            onChange={onToggleChange}
                        />
                    </div>
                </div>
                <div className={`px-5 w-full text-sm ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                    {state.isToggle ? 'This form is currently accepting responses' : 'This form is no longer accepting responses'}
                </div>
            </div>
            <div className="bg-white rounded-lg min-h-[136px] max-h-fit w-full border-[1px] py-3 flex flex-col gap-3">
                <div className="px-5 pb-3 border-b w-full flex items-center justify-between">
                    <div className="text-xl">Who has responded?</div>
                </div>
                <div className={`px-5 w-full text-sm flex flex-col gap-3`}>
                    {Object.keys(state.dates).map((item, index) => {
                        return (
                            <div key={`user-complete-${index}`} className="w-full flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-64">{item}</div>
                                    <div className="">{state.dates[item]?.length}</div>
                                </div>
                                <div className="">
                                    <IconView
                                        className="cursor-pointer"
                                        onClick={() => handleViewItem(item)}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Modal
                className="!w-[900px]"
                open={state.isViewModal}
                closeIcon={false}
                onCancel={() => setState(prev => ({...prev, isViewModal: false, detailAnswer: {}, detailUser: {}, isDetailTab: false}))}
                footer={[]}
            >
                {state.isDetailTab ? (
                    <DetailResponse
                        detailUser={state.detailUser}
                        detailAnswer={state.detailAnswer}
                        handleNavigateBack={handleNavigateBack}
                    />
                ) : (
                    <ListResponse
                        title={`Danh sách phản hồi: ${state.dateOpen}`}
                        date={state.dateOpen}
                        listUsers={state.selectedAssignee}
                        searchValue={state.searchValue}
                        searchText={state.searchText}
                        onDetailItem={onDetailItem}
                        onSearch={onSearch}
                    />
                )}
            </Modal>
        </div>
    );
};

export default Responses;