import React, { useMemo } from "react";

import { Input, Table } from "antd";

import useWindowSize from "../../../hooks/useWindowSize";
import { VSO } from "@utils/function";

const { Search } = Input;

import './style.css';

const ListResponse = (props) => {

    const { title, listUsers, onDetailItem, date, onSearch, searchValue, searchText } = props;

    const iw = useWindowSize().width;

    const columns = useMemo(() => {
        return VSO(iw, {
            900 : [
                {
                    title: 'Tên',
                    dataIndex: 'name',
                    sorter: (a, b) => a.name.length - b.name.length,
                    sortDirections: ['descend'],
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
                },
            ],

            768 : [
                {
                    title: 'Tên',
                    dataIndex: 'name',
                    sorter: (a, b) => a.name.length - b.name.length,
                    sortDirections: ['descend'],
                },
                {
                    title: 'Số căn cước',
                    dataIndex: 'cccd',
                },
                {
                    title: 'Thời gian',
                    dataIndex: 'modified_at',
                },
            ],
            
            320 : [
                {
                    title: 'Tên',
                    dataIndex: 'name',
                    sorter: (a, b) => a.name.length - b.name.length,
                    sortDirections: ['descend'],
                },
                {
                    title: 'Số căn cước',
                    dataIndex: 'cccd',
                },
            ],
        })
    },[iw])

    return (
        <div className="w-full min-h-[84vh] pt-5 max-h-[84vh] flex flex-col gap-4">
            <div className="w-full flex items-center justify-between">
                <div className="text-[16px] font-semibold w-full">{title}</div>
                <Search
                    placeholder="Tìm kiếm"
                    onChange={onSearch}
                />
            </div>
            <Table
                columns={columns}
                size="small"
                dataSource={searchText?.length > 0 ? searchValue : listUsers}
                className="overflow-y-auto flex-grow"
                tableLayout="5"
                sticky={true}
                pagination={{
                    hideOnSinglePage: true,
                    pageSize: 100
                }}
                onRow={(record, rowIndex) => {
                    return {
                      onClick: () => onDetailItem(record?._id, date),
                    };
                }}
            />
        </div>
    )
};

export default ListResponse;