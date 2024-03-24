import React, { useState } from "react";

import { DatePicker, Button, message } from 'antd';

const CommonQuestion = (props) => {

    const { handleNextStep } = props;

    const [state, setState] = useState({
        name:  '',
        birthday: '',
        cccd: '',
    });

    const onChangeBirthday = (date, dateString) => {
        state.birthday = dateString;
        setState(prev => ({...prev}));
    };

    const handleNext = () => {
        if (!state.name || !state.birthday || !state.cccd) {
            message.error('Hãy nhập đầy đủ thông tin!', 3);
            return;
        };

        const rs = {
            name: state.name,
            birthday: state.birthday,
            cccd: state.cccd,
        };

        handleNextStep(rs);
    };

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="bg-white rounded-lg p-3 min-h-[136px] max-h-fit w-full border-[1px] flex flex-col gap-3">
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
            <div className="bg-white rounded-lg p-3 min-h-[136px] max-h-fit w-full border-[1px] flex flex-col gap-3">
                <div className="px-5 flex flex-col gap-5">
                    <div className="font-medium">Ngày sinh: <span className="text-red-500">*</span></div>
                    <div className="w-auto">
                        <DatePicker
                            onChange={onChangeBirthday}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg p-3 min-h-[136px] max-h-fit w-full border-[1px] flex flex-col gap-3">
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