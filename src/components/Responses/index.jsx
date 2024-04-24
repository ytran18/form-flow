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
        detailAnswer: [],
        searchValue: [],
        searchText: '',
        dateSearch: null,
        totalAnswer: 0,
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
        let total = 0;
    
        const querySnapshot = await getDocs(query(collection(fireStore, 'answer')));

        querySnapshot.forEach((doc) => {
            const data = doc.data();

            if (!answersByDate[data?.date]) {
                answersByDate[data?.date] = [];
            };

            data?.lists?.map((item) => {
                if (item?.formId === formId) {
                    answersByDate[data?.date].push(item);
                    total++;
                };
            });
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

        state.totalAnswer = total;
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
        const formattedTime = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2, '0')}`;
        return {formattedTime, unixTime};
    }

    const formatName = (name) => {
        if (typeof name !== 'string') return;

        const arr = name.trim().toLowerCase().split(' ');
        const format = arr.map(item => item.charAt(0).toUpperCase() + item.slice(1));
        return format.join(' ');
    };

    const setTime = (date, year, month, day) => {
        date.setFullYear(year);
        date.setMonth(month - 1);
        date.setDate(day);
        return date;
    };

    const onSearch = (event, dates) => {
        const searchValue = event?.toLowerCase();

        let fromTime = setTime(new Date(dates?.[0]?.$d), Number(state.dateOpen.split('-')?.[0]),Number(state.dateOpen.split('-')?.[1]), Number(state.dateOpen.split('-')?.[2]));

        let toTime = setTime(new Date(dates?.[1]?.$d), Number(state.dateOpen.split('-')?.[0]),Number(state.dateOpen.split('-')?.[1]), Number(state.dateOpen.split('-')?.[2]));

        let arr = [...state.selectedAssignee];
        const results = [];
        let finals = [];

        if (searchValue) {
            arr.map((item) => {
                if (item?.name?.toLowerCase()?.includes(searchValue) || item?.cccd?.includes(searchValue)) {
                    results.push(item);
                };
            });
        };

        if (dates === null || dates === undefined) {
            finals = results; 
        } else {
            const mapArr = results.length > 0 ? results : [...state.selectedAssignee];
    
            dates !== null && mapArr.map((item) => {
                if (item?.modified_at?.unixTime >= (fromTime.getTime() / 1000) && item?.modified_at?.unixTime <= (toTime.getTime() / 1000)) finals.push(item);
            });
        };

        state.searchValue = finals;
        state.dateSearch = dates;
        state.searchText = searchValue;
        setState(prev => ({...prev}));
    };

    const handleViewItem = async (date, data) => {
        const answerIds = data.map(item => item.answerId);
        const chunkSize = 30;
    
        const answerIdChunks = [];
        for (let i = 0; i < answerIds.length; i += chunkSize) {
            answerIdChunks.push(answerIds.slice(i, i + chunkSize));
        }
    
        const answersList = [];
    
        for (const chunk of answerIdChunks) {
            const answerQuery = query(
                collection(fireStore, 'single_answer'),
                where('_id', 'in', chunk)
            );
    
            const querySnapshot = await getDocs(answerQuery);
            querySnapshot.forEach(doc => {
                const answerData = doc.data();
                answersList.push(answerData);
            });
        }
    
        const users = [...answersList];
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
        state.answers = answersList;
        // state.selectedUsers = users;
        state.isViewModal = !state.isViewModal;
        state.dateOpen = date;
        setState(prev => ({...prev}));
    };    

    const onDetailItem = (id, date) => {
        const user = state.answers.find(item => item?._id === id);

        const answer = user?.answers;
        let answerValue = new Array(answer?.length).fill(null);

        answer.map((item) => {
            const index = form?.questions?.findIndex(ele => ele?._id === item?.questionId);
            const type_question = item?.type_question;

            if (type_question === "choice" || type_question === 'dropdown') {
                form?.questions?.[index]?.answer?.map((ans) => {
                    if (ans?.value === item?.value && item?.label !== 'Add option') {
                        answerValue[index] = {
                            label: ans?.label,
                            dap_an: item?.value
                        };
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

        let arr = [];
        form?.questions.map((item, index) => {
            if (!item?.isHide) {
                const title = item?.title;
                const list_dap_an = item?.answer?.filter(value => value?.value !== 99);
                const data = {
                    cau_hoi: title,
                    cau_tra_loi: answerValue[index]?.label,
                    dap_an:  item?.dap_an,
                    tra_loi: answerValue[index]?.dap_an,
                    list_dap_an
                };
                arr.push(data);
            }
        });

        state.detailAnswer = arr;
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
                    <div className="text-2xl">{`${state.totalAnswer || 0} phản hồi`}</div>
                    <div className="flex items-center gap-3">
                        <div className="text-xs opacity-80 font-medium">Chấp nhận phải hồi</div>
                        <Switch
                            className="!bg-[rgb(140,140,140)]"
                            checked={isAvailable}
                            onChange={onToggleChange}
                        />
                    </div>
                </div>
                <div className={`px-5 w-full text-sm ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                    {state.isToggle ? 'Bài kiểm tra này đang chấp nhận phản hồi' : 'Bài kiểm tra này không còn chấp nhận phản hồi'}
                </div>
            </div>
            <div className="bg-white rounded-lg min-h-[136px] max-h-fit w-full border-[1px] py-3 flex flex-col gap-3">
                <div className="px-5 pb-3 border-b w-full flex items-center justify-between">
                    <div className="text-xl">Danh sách phản hồi</div>
                </div>
                <div className={`px-5 w-full text-sm flex flex-col gap-3`}>
                    {Object.keys(state.dates).map((item, index) => {
                        return (
                            <div key={`user-complete-${index}`} className="w-full flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-40 md:w-64">{item}</div>
                                    <div className="">{state.dates[item]?.length}</div>
                                </div>
                                <div className="">
                                    <IconView
                                        className="cursor-pointer"
                                        onClick={() => handleViewItem(item, state.dates[item])}
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
                onCancel={() => setState(prev => ({...prev, isViewModal: false, detailAnswer: {}, detailUser: {}, isDetailTab: false, selectedAssignee: []}))}
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
                        dateSearch={state.dateSearch}
                        onDetailItem={onDetailItem}
                        onSearch={onSearch}
                    />
                )}
            </Modal>
        </div>
    );
};

export default Responses;