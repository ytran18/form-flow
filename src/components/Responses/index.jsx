import React, { useEffect, useState } from "react";

import { fireStore } from "@core/firebase/firebase";
import { collection, getDocs, query, where } from 'firebase/firestore';

import { Switch } from 'antd';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import IconDownload from '@icon/iconDownload.svg';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const Responses = (props) => {

    const { formId, form } = props;

    const [state, setState] = useState({
        isToggle: true,
        answers: [],
        users: [],
    });

    const getData = async () => {
        let answers = [];
        const querySnapshot = await getDocs(query(collection(fireStore, 'answers'), where('formId', '==', formId)));

        querySnapshot.forEach((doc) => {
            if (doc.data()) answers.push(doc.data());
        });
        const filterUsers = [...answers];
        filterUsers.map((item) => { return item.assignee });

        state.answers = answers;
        state.users = filterUsers;
        setState(prev => ({...prev}));
    };

    useEffect(() => {
        getData();
    },[]);

    const onToggleChange = (checked) => {
        state.isToggle = checked;
        setState(prev => ({...prev}));
    };

    const handleDownloadExcel = (answerId) => {
        const answer = state.answers.find(element => element._id === answerId);
        let answerValue = new Array(answer?.answers?.length).fill(null);

        answer?.answers.map((item) => {
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

        const name = answer?.assignee?.name;
        const birthday = answer?.assignee?.birthday;
        const cccd = answer?.assignee?.cccd;
        const cong_ty = answer?.assignee?.company;

        let obj = {};
        answerValue.map((item, index) => {
            obj[`Câu ${index + 1}`] = item;
        });

        const table = [{
            'Tên': name,
            'Ngày sinh': birthday,
            'Căn cước công dân': cccd,
            'Công ty': cong_ty,
            ...obj,
        }];

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
                            checked={state.isToggle}
                            onChange={onToggleChange}
                        />
                    </div>
                </div>
                <div className={`px-5 w-full text-sm ${state.isToggle ? 'text-green-500' : 'text-red-500'}`}>
                    {state.isToggle ? 'This form is currently accepting responses' : 'This form is no longer accepting responses'}
                </div>
            </div>
            <div className="bg-white rounded-lg min-h-[136px] max-h-fit w-full border-[1px] py-3 flex flex-col gap-3">
                <div className="px-5 pb-3 border-b w-full flex items-center justify-between">
                    <div className="text-xl">Who has responded?</div>
                </div>
                <div className={`px-5 w-full text-sm flex flex-col gap-3`}>
                    {state.users.map((item, index) => {
                        return (
                            <div key={`user-complete-${index}`} className="w-full flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-64">{item?.assignee?.name}</div>
                                    <div className="w-52">{item?.assignee?.cccd}</div>
                                </div>
                                <div className="">
                                    <IconDownload
                                        className="cursor-pointer"
                                        onClick={() => handleDownloadExcel(item?._id)}
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