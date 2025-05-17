import React, { useMemo } from "react";

import { Input, Table, TimePicker } from "antd";

import useWindowSize from "../../../hooks/useWindowSize";
import { VSO } from "@utils/function";
import { convertTimeToMinutes, getLastWordFirstChar } from "@utils/function";

import IconEye from '@icon/iconEye.svg'

import './style.css';
import DelayedDownload from "@core/pdf/DelayedDownload";

const { Search } = Input;

const ListResponse = (props) => {

    const { title, listUsers, onDetailItem, onSearch, searchValue, searchText, dateSearch } = props;

    const iw = useWindowSize().width;

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
                {
                    title: 'Thời gian',
                    dataIndex: 'modified_at',
                    sorter: (a, b) => {
                        const aMinutes = convertTimeToMinutes(a.modified_at);
                        const bMinutes = convertTimeToMinutes(b.modified_at);

                        return aMinutes - bMinutes;
                    },
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: '',
                    key: 'actions',
                    render: (_, data) => {
                        return (
                            <div className="flex items-center justify-between">
                                <DelayedDownload name={data?.name} birthday={data?.birthday} companyName={data?.company} image={data?.cccd_font_pic} id={data?._id} />

                                <div onClick={() => onDetailItem(data?._id)}>
                                    <IconEye className='w-5 h-5 cursor-pointer' />
                                </div>
                            </div>
                        )
                    }
                }
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
                {
                    title: 'Thời gian',
                    dataIndex: 'modified_at',
                    sorter: (a, b) => {
                        const aMinutes = convertTimeToMinutes(a.modified_at);
                        const bMinutes = convertTimeToMinutes(b.modified_at);

                        return aMinutes - bMinutes;
                    },
                    sortDirections: ['descend', 'ascend'],
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

    const handleSearch = (searchEvent, dates) => {
        onSearch(searchEvent, dates)
    };

    return (
        <div className="w-full min-h-[84vh] pt-5 max-h-[84vh] flex flex-col gap-4">
            <div className="w-full flex-col ml:flex-row flex items-center gap-5">
                <div className="text-[16px] font-semibold w-full ml:w-auto">{title}</div>
                <div className="flex flex-grow ml:justify-end items-center gap-3 w-full ml:w-auto">
                    <Search
                        placeholder="Tìm kiếm"
                        className="w-[50%]"
                        onChange={(event) => handleSearch(event.target.value, dateSearch)}
                    />
                    <TimePicker.RangePicker
                        format={"HH:mm"}
                        needConfirm={true}
                        className="flex-grow ml:flex-grow-0 !h-8"
                        showNow
                        placeholder={["Bắt đầu", "Kết thúc"]}
                        changeOnScroll
                        onChange={(dates) => handleSearch(searchText, dates)}
                    />
                </div>
            </div>
            <Table
                columns={columns}
                size="small"
                dataSource={(searchText.length > 0 || dateSearch !== null) ? searchValue?.map((item) => {
                    return {
                        ...item,
                        modified_at: item?.modified_at?.formattedTime
                    }
                }) : listUsers?.map((item) => {
                    return {
                        ...item,
                        modified_at: item?.modified_at?.formattedTime
                    }
                })}
                className="overflow-y-auto flex-grow"
                tableLayout="5"
                sticky={true}
                pagination={{
                    hideOnSinglePage: true,
                    pageSize: 100
                }}
            />
        </div>
    )
};

export default ListResponse;