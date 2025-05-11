import React, { useEffect, useState, useMemo } from "react";

import { fireStore } from "@core/firebase/firebase";
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';

import { Switch, Modal, Input, Table } from 'antd';

import ListResponse from "./ListResponse";
import DetailResponse from "./DetailResponse";

import { VSO } from "@utils/function";
import useWindowSize from "../../hooks/useWindowSize";
import { getLastWordFirstChar, unixTimeToFormattedTime, formatName, setTime } from "@utils/function";

import IconView from '@icon/iconView.svg';

const { Search } = Input;

const Responses = (props) => {

    const { formId, form, isAvailable, onToggleChange, isTinhDiem } = props;

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
        maxDiem: 0,
        tongDiem: 0,
        isCompanySearch: false,
        companySearchValue: '',
        allAnswers: [],
        companySearchResult: [],
        candidateSearch: '',
        candidateSearchResult: [],
    });

    const iw = useWindowSize().width;

    const getData = async () => {
        let answersByDate = {};
        let total = 0;
        const allAnswers = [];
    
        const querySnapshot = await getDocs(query(collection(fireStore, 'answer-new')));

        querySnapshot.forEach((doc) => {
            const data = doc.data();

            if (!answersByDate[data?.date]) {
                answersByDate[data?.date] = [];
            };

            data?.lists?.map((item) => {
                if (item?.formId === formId) {
                    allAnswers.push(item);
                    answersByDate[data?.date].push(item);
                    total++;
                };
            });
        });

        // remove if reponse === 0
        Object.keys(answersByDate).forEach((item) => {
            if (answersByDate[item]?.length === 0) {
                delete answersByDate[item];
            }
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

        let maxDiem = 0;
        if (form?.questions?.length > 0) {
            form?.questions?.map((item) => {
                if (!item?.isHide) maxDiem += Number(item?.diem);
            });
        };

        state.totalAnswer = total;
        state.maxDiem = maxDiem;
        state.dates = sortedAnswersByDate;
        state.allAnswers = allAnswers;
        setState(prev => ({ ...prev }));
    };

    useEffect(() => {
        getData();
    },[]);

    const onSearch = (event, dates) => {
        const searchValue = event?.toLowerCase();

        let fromTime = setTime(new Date(dates?.[0]?.$d), Number(state.dateOpen.split('-')?.[0]),Number(state.dateOpen.split('-')?.[1]), Number(state.dateOpen.split('-')?.[2]));

        let toTime = setTime(new Date(dates?.[1]?.$d), Number(state.dateOpen.split('-')?.[0]),Number(state.dateOpen.split('-')?.[1]), Number(state.dateOpen.split('-')?.[2]));

        let arr = [...state.selectedAssignee];
        const results = [];
        let finals = [];

        if (searchValue) {
            arr.map((item) => {
                if (item?.name?.toLowerCase()?.includes(searchValue) || item?.cccd?.includes(searchValue) || item?.company?.toLowerCase()?.trim()?.includes(searchValue)) {
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

    const onDetailItem = async (id, isSearchOutside) => {
        let user;
        if (isSearchOutside) {
            const docRef = doc(fireStore, 'single_answer', id);
            const test = await getDoc(docRef);
            if (test.exists()) user = test.data();
        } else {
            user = state.answers.find(item => item?._id === id);
        };

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
        let tong_diem = 0;
        form?.questions.map((item, index) => {
            if (!item?.isHide) {
                if ((item?.dap_an === answerValue[index]?.dap_an) && isTinhDiem) tong_diem += item?.diem;
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

        if (isSearchOutside) {
            state.isViewModal = true;
            state.isDetailTab = true;
        };
        state.detailAnswer = arr;
        state.detailUser = user;
        state.isDetailTab = true;
        state.tongDiem = tong_diem;
        setState(prev => ({...prev}));
    };

    const handleCompanyNameSearch = (name) => {
        const { allAnswers } = state;
        const lowerCaseName = name.toLowerCase().trim();
        const listsSearch = [];

        allAnswers.map((item) => {
            if (item?.assignee?.company_lower?.trim()?.includes(lowerCaseName)) {
                const rs = {
                    ...item?.assignee,
                    name: formatName(item?.assignee?.name),
                    _id: item?.answerId,
                };

                listsSearch.push(rs);
            }
        });

        state.companySearchResult = listsSearch;
        setState(prev => ({...prev}));
    };

    useEffect(() => {
        const { companySearchValue } = state;

        const searchTimeout = setTimeout(() => {
            if (companySearchValue) {
                handleCompanyNameSearch(companySearchValue);
            }
        }, 2000);

        return () => clearTimeout(searchTimeout);
    },[state.companySearchValue]);

    useEffect(() => {
        const { candidateSearch, companySearchResult } = state;

        if (candidateSearch) {
            const value = [];
            companySearchResult.map((item) => {
                const formatName = item?.name?.toLowerCase()?.trim();
                const formatCCCD = item?.cccd?.toLowerCase()?.trim();
                const formatSearch = candidateSearch.toLocaleLowerCase().trim();
                if (formatName?.includes(formatSearch) || formatCCCD?.includes(formatSearch)) {
                    value.push(item);
                };
            });

            state.candidateSearchResult = value;
            setState(prev => ({...prev}));
        };

    },[state.candidateSearch]);

    const handleNavigateBack = () => {
        state.isDetailTab = false;
        state.detailAnswer = {};
        state.detailUser = {};

        setState(prev => ({...prev}));
    };

    const columns = useMemo(() => {
        return VSO(iw, {
            900 : [
                {
                    title: 'Tên',
                    dataIndex: 'name',
                    sorter: (a, b) => {
                        const aLastChar = getLastWordFirstChar(a.name);
                        const bLastChar = getLastWordFirstChar(b.name);

                        return aLastChar.localeCompare(bLastChar);
                    },
                    sortDirections: ['descend', 'ascend'], 
                },
                {
                    title: 'Số căn cước',
                    dataIndex: 'cccd',
                },
                {
                    title: 'Công ty',
                    dataIndex: 'company',
                },
                {
                    title: 'Ngày sinh',
                    dataIndex: 'birthday',
                },
            ],

            768 : [
                {
                    title: 'Tên',
                    dataIndex: 'name',
                    sorter: (a, b) => {
                        const aLastChar = getLastWordFirstChar(a.name);
                        const bLastChar = getLastWordFirstChar(b.name);

                        return aLastChar.localeCompare(bLastChar);
                    },
                    sortDirections: ['descend', 'ascend'], 
                },
                {
                    title: 'Số căn cước',
                    dataIndex: 'cccd',
                },
            ],
            
            320 : [
                {
                    title: 'Tên',
                    dataIndex: 'name',
                    sorter: (a, b) => {
                        const aLastChar = getLastWordFirstChar(a.name);
                        const bLastChar = getLastWordFirstChar(b.name);

                        return aLastChar.localeCompare(bLastChar);
                    },
                    sortDirections: ['descend', 'ascend'], 
                },
                {
                    title: 'Số căn cước',
                    dataIndex: 'cccd',
                },
            ],
        })
    },[iw]);

    if (state.dates.length === 0) return <div className="text-red-400 font-semibold text-center">Đang được cập nhật, nếu không load được hãy refresh trang web vài lần, xin cảm ơn!</div>

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
                    {state.isCompanySearch ? (
                        <div className="flex flex-col gap-y-1 w-1/2">
                            <Search
                                placeholder="Tìm kiếm theo công ty"
                                className="w-full"
                                value={state.companySearchValue}
                                onChange={(e) => setState(prev => ({...prev, companySearchValue: e.target.value}))}
                            />

                            <div className="text-red-500 font-semibold">* Tìm kiếm theo tên công ty trước rồi mới tìm kiếm theo tên hoặc cccd theo danh sách người làm bài trong công ty đó!</div>
                        </div>
                    ) : (
                        <div className="text-xl">Danh sách phản hồi</div>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="">Tìm kiếm theo công ty</div>
                        <Switch
                            className="!bg-[rgb(140,140,140)]"
                            checked={state.isCompanySearch}
                            onChange={(checked) => setState(prev => ({...prev, isCompanySearch: checked}))}
                        />
                    </div>
                </div>
                <div className={`px-5 w-full text-sm flex flex-col gap-3`}>
                    {state.isCompanySearch ? (
                        <>
                            <div className="w-full flex justify-end">
                                <Search
                                    className={`${iw < 640 ? 'w-full' : 'w-1/2'}`}
                                    placeholder="Nhập tên hoặc CCCD (phải tiềm kiếm theo tên công ty trước)"
                                    value={state.candidateSearch}
                                    disabled={state.companySearchResult.length === 0}
                                    onChange={(e) => setState(prev => ({...prev, candidateSearch: e.target.value}))}
                                />
                            </div>
                            <Table
                                columns={columns}
                                size="small"
                                dataSource={state.candidateSearch.length > 0 ? state.candidateSearchResult : state.companySearchResult}
                                className="overflow-y-auto flex-grow"
                                tableLayout="5"
                                sticky={true}
                                pagination={{
                                    hideOnSinglePage: true,
                                    pageSize: 100
                                }}
                                onRow={(record, rowIndex) => {
                                    return {
                                        onClick: () => onDetailItem(record?._id, true),
                                    };
                                }}
                            />
                        </>
                    ) : (
                        Object.keys(state.dates).map((item, index) => {
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
                        })
                    )}
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
                        isTinhDiem={isTinhDiem}
                        maxDiem={state.maxDiem}
                        tongDiem={state.tongDiem}
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