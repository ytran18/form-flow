import React, { useState } from "react";

import { Radio } from 'antd';

import Question from "./Question";

const Assignment = (props) => {

    const { form, infoQuestion } = props;

    const [state, setState] = useState({
        isInfo: null,
        infoBooleanChange: false,
    });

    const onChangeInfoBoolean = (event) => {
        state.isInfo = event?.target?.value;
        state.infoBooleanChange = true;
        setState(prev => ({...prev}));
    };

    return (
        <div className="w-full flex flex-col gap-5 mb-10">
            <div className="bg-white rounded-lg p-3 min-h-fit max-h-fit w-full border-[1px] flex flex-col gap-3">
                <div className="px-5 flex flex-col gap-5">
                    <div className="font-medium">
                        Bạn có phải là <span className="text-red-500">{infoQuestion.name}</span>,
                        sinh ngày <span className="text-red-500">{infoQuestion.birthday}</span>,
                        CCCD số <span className="text-red-500">{infoQuestion.cccd}</span> không?
                        <span className="text-red-500">*</span>
                    </div>
                    <div className="w-full">
                        <Radio.Group
                            value={state.isInfo}
                            className="flex flex-col w-full gap-3"
                            onChange={onChangeInfoBoolean}
                        >
                            <Radio value={1}>Đúng</Radio>
                            <Radio value={2}>Không</Radio>
                        </Radio.Group>
                    </div>
                    {state.infoBooleanChange && (
                        <div
                            className="w-full text-sm flex justify-end cursor-pointer"
                            onClick={() => setState(prev => ({...prev, isInfo: null, infoBooleanChange: false}))}
                        >
                            <div className="py-1 px-5 hover:bg-[rgb(249,249,249)]">
                                Xoá lựa chọn
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {form?.questions?.length > 0 && form?.questions?.map((item, index) => {
                return (
                    <div key={`question-assignment-${index}`}>
                        <Question
                            question={item}
                        />
                    </div>
                )
            })}
        </div>
    );
};

export default Assignment;