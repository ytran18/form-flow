import React, { useEffect, useState } from "react";

import { fireStore } from "@core/firebase/firebase";
import { collection, getDocs, query, where } from 'firebase/firestore';

import { Switch } from 'antd';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import IconDownload from '@icon/iconDownload.svg';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const Responses = (props) => {

    const { formId, form, isAvailable, onToggleChange } = props;

    const [state, setState] = useState({
        isToggle: true,
        answers: [],
        dates: [],
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

    // const onToggleChange = (checked) => {
    //     state.isToggle = checked;
    //     setState(prev => ({...prev}));
    // };

    const handleDownloadExcel = (date) => {
        const table = [];
        const users = state.dates[date];
        users.map((item) => {
            const answer = item.answers;
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
            const name = item?.assignee?.name;
            const birthday = item?.assignee?.birthday;
            const cccd = item?.assignee?.cccd;
            const cong_ty = item?.assignee?.company;

            let obj = {};
            answerValue.map((item, index) => {
                obj[`Câu ${index + 1}`] = item;
            });

            table.push({
                'Tên': name,
                'Ngày sinh': birthday,
                'Căn cước công dân': cccd,
                'Công ty': cong_ty,
                ...obj,
            })
        });

        const ws = XLSX.utils.json_to_sheet(table);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, `${form?.formTitle}.xlsx`);
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
                                    <IconDownload
                                        className="cursor-pointer"
                                        onClick={() => handleDownloadExcel(item)}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default Responses;