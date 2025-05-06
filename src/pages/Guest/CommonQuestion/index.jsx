import React, { useState } from "react";

import { logErrorToFirestore } from "@utils/function";
import { DatePicker, Button, message, Select, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import imageCompression from 'browser-image-compression';

import { useDispatch } from "react-redux";
import { assigneePackage } from "@core/redux/actions";

import './style.css';
const { Dragger } = Upload;

const acceptedImageTypes = ['image/png', 'image/jpeg', 'image/gif'];

const CommonQuestion = (props) => {

    const { handleNextStep } = props;

    const [state, setState] = useState({
        name:  '',
        birthday: {
            month: 'Tháng',
            date: 'Ngày',
            year: ''
        },
        cccd: '',
        company: '',
        file: [],
    });

    const dispatch = useDispatch();

    const months = [
        { value: '1', label: 'Tháng 1'},
        { value: '2', label: 'Tháng 2'},
        { value: '3', label: 'Tháng 3'},
        { value: '4', label: 'Tháng 4'},
        { value: '5', label: 'Tháng 5'},
        { value: '6', label: 'Tháng 6'},
        { value: '7', label: 'Tháng 7'},
        { value: '8', label: 'Tháng 8'},
        { value: '9', label: 'Tháng 9'},
        { value: '10', label: 'Tháng 10'},
        { value: '11', label: 'Tháng 11'},
        { value: '12', label: 'Tháng 12'},
    ];

    const days31 = [
        { value: '1', label: 1}, { value: '2', label: 2}, { value: '3', label: 3},
        { value: '4', label: 4}, { value: '5', label: 5}, { value: '6', label: 6},
        { value: '7', label: 7}, { value: '8', label: 8}, { value: '9', label: 9},
        { value: '10', label: 10}, { value: '11', label: 11}, { value: '12', label: 12},
        { value: '13', label: 13}, { value: '14', label: 14}, { value: '15', label: 15},
        { value: '16', label: 16}, { value: '17', label: 17}, { value: '18', label: 18},
        { value: '19', label: 19}, { value: '20', label: 20}, { value: '21', label: 21},
        { value: '22', label: 22}, { value: '23', label: 23}, { value: '24', label: 24},
        { value: '25', label: 25}, { value: '26', label: 26}, { value: '27', label: 27},
        { value: '28', label: 28}, { value: '29', label: 29}, { value: '30', label: 30},
        { value: '31', label: 31},
    ];

    const days30 = [
        { value: '1', label: 1}, { value: '2', label: 2}, { value: '3', label: 3},
        { value: '4', label: 4}, { value: '5', label: 5}, { value: '6', label: 6},
        { value: '7', label: 7}, { value: '8', label: 8}, { value: '9', label: 9},
        { value: '10', label: 10}, { value: '11', label: 11}, { value: '12', label: 12},
        { value: '13', label: 13}, { value: '14', label: 14}, { value: '15', label: 15},
        { value: '16', label: 16}, { value: '17', label: 17}, { value: '18', label: 18},
        { value: '19', label: 19}, { value: '20', label: 20}, { value: '21', label: 21},
        { value: '22', label: 22}, { value: '23', label: 23}, { value: '24', label: 24},
        { value: '25', label: 25}, { value: '26', label: 26}, { value: '27', label: 27},
        { value: '28', label: 28}, { value: '29', label: 29}, { value: '30', label: 30},
    ];

    const days28 = [
        { value: '1', label: 1}, { value: '2', label: 2}, { value: '3', label: 3},
        { value: '4', label: 4}, { value: '5', label: 5}, { value: '6', label: 6},
        { value: '7', label: 7}, { value: '8', label: 8}, { value: '9', label: 9},
        { value: '10', label: 10}, { value: '11', label: 11}, { value: '12', label: 12},
        { value: '13', label: 13}, { value: '14', label: 14}, { value: '15', label: 15},
        { value: '16', label: 16}, { value: '17', label: 17}, { value: '18', label: 18},
        { value: '19', label: 19}, { value: '20', label: 20}, { value: '21', label: 21},
        { value: '22', label: 22}, { value: '23', label: 23}, { value: '24', label: 24},
        { value: '25', label: 25}, { value: '26', label: 26}, { value: '27', label: 27},
        { value: '28', label: 28}
    ];

    const days29 = [
        { value: '1', label: 1}, { value: '2', label: 2}, { value: '3', label: 3},
        { value: '4', label: 4}, { value: '5', label: 5}, { value: '6', label: 6},
        { value: '7', label: 7}, { value: '8', label: 8}, { value: '9', label: 9},
        { value: '10', label: 10}, { value: '11', label: 11}, { value: '12', label: 12},
        { value: '13', label: 13}, { value: '14', label: 14}, { value: '15', label: 15},
        { value: '16', label: 16}, { value: '17', label: 17}, { value: '18', label: 18},
        { value: '19', label: 19}, { value: '20', label: 20}, { value: '21', label: 21},
        { value: '22', label: 22}, { value: '23', label: 23}, { value: '24', label: 24},
        { value: '25', label: 25}, { value: '26', label: 26}, { value: '27', label: 27},
        { value: '28', label: 28}, { value: '29', label: 29},
    ];

    const fullDates = ['1', '3', '5', '7', '8', '10', '12'];

    const onChangeYear = (date, dateString) => {
        state.birthday.year = dateString;
        state.birthday.date = 'Ngày';
        setState(prev => ({...prev}));
    };

    const onChangeMonth = (event) => {
        state.birthday.month = event;
        state.birthday.date = 'Ngày';
        setState(prev => ({...prev}));
    };
    
    const onChangeDate = (event) => {
        state.birthday.date = event;
        setState(prev => ({...prev}));
    };

    const isLeapYear = (y) => {
        const year = y - 0;
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    };

    const handleNext = () => {
        if (!state.name || !state.birthday.date || !state.birthday.month || !state.birthday.year || !state.cccd) {
            message.error('Hãy nhập đầy đủ thông tin!', 3);
            return;
        };

        const date = state.birthday.date;
        const month = state.birthday.month;
        if (date === 'Ngày' || month === 'Tháng') {
            message.error('Hãy nhập đầy đủ thông tin!', 3);
            return;
        };

        const rs = {
            name: state.name,
            birthday: `${state.birthday.date}-${state.birthday.month}-${state.birthday.year}`,
            cccd: state.cccd,
            company: state.company,
            company_lower: state.company.toLowerCase().trim(),
            cccd_font_pic: state.file[0]?.originFileObj,
        };

        dispatch(assigneePackage(rs));
        handleNextStep(rs);
    };

    const options = state.birthday.month != '2' ? fullDates.includes(state.birthday.month) ? days31 : days30 : isLeapYear(state.birthday.year) ? days29 : days28;

    const uploadProps = {
        name: 'file',
        multiple: false,
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        onChange(info) {
            if (info.file.status === "removed") {
                state.file = [];
                setState(prev => ({ ...prev }));
                return;
            };
    
            setState(prev => ({ ...prev, file: [info.file] }));
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        beforeUpload: async (file) => {
            const isPNG = acceptedImageTypes.includes(file.type);
            if (!isPNG) {
                const errorMessage = `Chỉ chấp nhận các định dạng hình ảnh: png, jpeg, jpg`;
                message.error(errorMessage);
                
                await logErrorToFirestore(errorMessage); // Log lỗi vào Firestore
                return Upload.LIST_IGNORE;
            }
    
            try {
                // Cấu hình nén hình ảnh
                const options = {
                    maxSizeMB: 0.5, // Giảm kích thước xuống tối đa 500KB
                    maxWidthOrHeight: 1024, // Giới hạn chiều rộng/chiều cao tối đa là 1024px
                    useWebWorker: true,
                };

                // Nén hình ảnh
                const compressedFile = await imageCompression(file, options);
    
                // Thay thế file gốc bằng file đã nén
                const newFile = new File([compressedFile], file.name, { type: file.type });
                state.file = [newFile];
                setState(prev => ({ ...prev }));
    
                return newFile;
            } catch (error) {
                const errorMessage = `Lỗi khi nén hình ảnh: ${error.message}`;
                console.error(errorMessage);
                message.error('Lỗi khi nén hình ảnh!');
                await logErrorToFirestore(errorMessage); // Log lỗi vào Firestore
                return Upload.LIST_IGNORE;
            }
        },
        fileList: state.file,
    };

    return (
        <div className="w-full flex flex-col gap-5 guest-common">
            <div className="bg-white rounded-lg p-3 min-h-fit max-h-fit w-full border-[1px] flex flex-col gap-3">
                <div className="px-5 flex flex-col gap-5">
                    <div className="font-medium">Họ tên: <span className="text-red-500">*</span></div>
                    <div className="w-full border-b border-solid border-[rgb(219,219,219)]">
                        <input
                            type="text"
                            value={state.name}
                            onChange={(e) => setState(prev => ({...prev, name: e?.target?.value}))}
                            className="outline-none py-2 w-full"
                        />
                    </div>
                </div>
                <div className="px-5">
                </div>
            </div>
            <div className="bg-white rounded-lg p-3 min-h-fit max-h-fit w-full border-[1px] flex flex-col gap-3">
                <div className="px-5 flex flex-col gap-5">
                    <div className="font-medium">Ngày sinh: <span className="text-red-500">*</span></div>
                    <div className="w-auto flex flex-col sm:flex-row items-center gap-5">
                        <DatePicker
                            picker="year"
                            placeholder="Năm sinh"
                            className="w-full sm:w-[150px]"
                            onChange={onChangeYear}
                        />
                        <Select
                            showSearch
                            placeholder="Tháng"
                            className="w-full sm:w-[150px]"
                            options={months}
                            value={state.birthday.month}
                            onChange={onChangeMonth}
                        />
                        <Select
                            showSearch
                            placeholder="Ngày"
                            className="w-full sm:w-[150px]"
                            options={options}
                            value={state.birthday.date}
                            onChange={onChangeDate}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg p-3 min-h-fit max-h-fit w-full border-[1px] flex flex-col gap-3">
                <div className="px-5 flex flex-col gap-5">
                    <div className="font-medium">Căn cước công dân: <span className="text-red-500">*</span></div>
                    <div className="w-full border-b border-solid border-[rgb(219,219,219)]">
                        <input
                            type="number"
                            value={state.cccd}
                            onChange={(e) => setState(prev => ({...prev, cccd: e?.target?.value}))}
                            className="outline-none py-2 w-full"
                        />
                    </div>
                </div>
                <div className="px-5">
                </div>
            </div>
            <div className="bg-white rounded-lg p-3 min-h-fit max-h-fit w-full border-[1px] flex flex-col gap-3">
                <div className="px-5 flex flex-col gap-5">
                    <div className="font-medium">Chụp ảnh (hình) chân dung hoặc mặt trước CCCD:</div>
                </div>
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon"> <InboxOutlined /> </p>
                    <p className="ant-upload-text">Click hoặc kéo tệp vào khu vực này để tải lên.</p>
                    <p className="ant-upload-hint">
                        Hỗ trợ tải lên đơn lẻ. Cấm nghiêm ngặt tải lên dữ liệu của công ty hoặc các tệp bị cấm khác.
                    </p>
                </Dragger>
                <div className="px-5">
                </div>
            </div>
            <div className="bg-white rounded-lg p-3 min-h-fit max-h-fit w-full border-[1px] flex flex-col gap-3">
                <div className="px-5 flex flex-col gap-5">
                    <div className="font-medium">Công ty:</div>
                    <div className="w-full border-b border-solid border-[rgb(219,219,219)]">
                        <input
                            type="text"
                            value={state.company}
                            onChange={(e) => setState(prev => ({...prev, company: e?.target?.value}))}
                            className="outline-none py-2 w-full"
                        />
                    </div>
                </div>
                <div className="px-5">
                </div>
            </div>
            <div className="w-full flex justify-end">
                <Button
                    type="primary"
                    className="bg-[#1677ff]"
                    onClick={handleNext}
                >
                    Tiếp tục
                </Button>
            </div>
        </div>
    );
};

export default CommonQuestion;