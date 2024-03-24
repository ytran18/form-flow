import React, { useState, useEffect } from "react";

import { Radio, Select, Checkbox } from 'antd';

const Question = (props) => {

    const { question } = props;
    const type_answer = question?.type_answer;

    const [state, setState] = useState({
        choice: null,
        isHasImg: false,
        isChangeChoice: false,
        dropdown: null,
        isChangeDropdown: false,
        multiple: [],
        isChangeMultiple: false,
    });

    useEffect(() => {
        if (question && question?.answer?.length > 0) {
            let isHasImg = false;
            for (let i = 0; i < question?.answer?.length; i++) {
                if (question?.answer?.[i]?.img_url?.length > 0) {
                    isHasImg = true;
                    break;
                };
            };
            
            state.isHasImg = isHasImg;
            setState(prev => ({...prev}));
        };
    },[question]);

    const onChangeChoice = (event) => {
        state.choice = event?.target?.value;
        state.isChangeChoice = true;
        setState(prev => ({...prev}));
    };

    const onChangeDropdown = (event) => {
        state.isChangeDropdown = true;
        state.dropdown = event;
        setState(prev => ({...prev}));
    };

    const onChangeMultiple = (event) => {
        state.multiple = event;
        state.isChangeMultiple = true;
        setState(prev => ({...prev}));
    };

    const onInput = (e) => {
        const element = e.target;
        if (element.value.trim() === '') {
            element.style.height = '40px';
        } else {
            element.style.height = element.scrollHeight > 40 ? `${element.scrollHeight}px` : '40px';
        };
    };

    return (
        <div className="bg-white rounded-lg p-3 min-h-fit max-h-fit w-full border-[1px] flex flex-col gap-3">
            <div className="px-5 flex flex-col">
                <div className="font-medium mb-5">
                    {question?.title || 'Untitled'}
                </div>
                {type_answer === 'choice' && (
                    <div className="w-full">
                        <Radio.Group
                            value={state.choice}
                            className={`${state.isHasImg ? 'grid grid-cols-2' : 'flex flex-col'} w-full gap-3`}
                            onChange={onChangeChoice}
                        >
                            {question?.answer?.length > 0 && question?.answer?.map((item, index) => {
                                return (
                                    state.isHasImg ? (
                                        <div
                                            key={`question-answer-guest-${index}`}
                                            className="flex flex-col items-center gap-2"
                                        >
                                            <div
                                                className={`w-[268px] h-[211px] flex items-center justify-center ${item?.img_url?.length > 0 ? 'bg-white' : 'bg-[rgb(245,245,245)]'}`}
                                                style={{
                                                    boxShadow:item?.img_url?.length > 0 ? '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)' : ''
                                                }}
                                            >
                                                <img src={item?.img_url} className="w-[95%] max-h-[90%]"/>
                                            </div>
                                            <div className={`w-[268px]`}>
                                                <Radio value={index + 1}>{item?.label}</Radio>
                                            </div>
                                        </div>
                                    ) : (
                                        <Radio
                                            key={`question-answer-guest-${index}`}
                                            value={index + 1}
                                        >
                                            {item?.label}
                                        </Radio>
                                    )
                                )
                            })}
                        </Radio.Group>
                        {state.isChangeChoice && (
                            <div
                                className="w-full text-sm flex justify-end cursor-pointer"
                                onClick={() => setState(prev => ({...prev, choice: null, isChangeChoice: false}))}
                            >
                                <div className="py-1 px-5 hover:bg-[rgb(249,249,249)]">
                                    Xoá lựa chọn
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {type_answer === 'multiple-choice' && (
                    <div className="w-full">
                        <Checkbox.Group
                            value={state.multiple}
                            className={`${state.isHasImg ? 'grid grid-cols-2' : 'flex flex-col'} w-full gap-3`}
                            onChange={onChangeMultiple}
                        >
                            {question?.answer?.length > 0 && question?.answer?.map((item, index) => {
                                return (
                                    state.isHasImg ? (
                                        <div
                                            key={`question-answer-guest-${index}`}
                                            className="flex flex-col items-center gap-2"
                                        >
                                            <div
                                                className={`w-[268px] h-[211px] flex items-center justify-center ${item?.img_url?.length > 0 ? 'bg-white' : 'bg-[rgb(245,245,245)]'}`}
                                                style={{
                                                    boxShadow:item?.img_url?.length > 0 ? '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)' : ''
                                                }}
                                            >
                                                <img src={item?.img_url} className="w-[95%] max-h-[90%]"/>
                                            </div>
                                            <div className={`w-[268px]`}>
                                                <Checkbox value={index + 1}>{item?.label}</Checkbox>
                                            </div>
                                        </div>
                                    ) : (
                                        <Checkbox
                                            key={`question-answer-guest-${index}`}
                                            value={index + 1}
                                        >
                                            {item?.label}
                                        </Checkbox>
                                    )
                                )
                            })}
                        </Checkbox.Group>
                        {state.isChangeChoice && (
                            <div
                                className="w-full text-sm flex justify-end cursor-pointer"
                                onClick={() => setState(prev => ({...prev, choice: null, isChangeChoice: false}))}
                            >
                                <div className="py-1 px-5 hover:bg-[rgb(249,249,249)]">
                                    Xoá lựa chọn
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {type_answer === 'dropdown' && (
                    <div className="w-full">
                        <Select
                            className="w-[200px]"
                            placeholder="Chọn"
                            value={state.dropdown}
                            onChange={onChangeDropdown}
                            options={question?.answer}
                        />
                        {state.isChangeDropdown && (
                            <div
                                className="w-full text-sm flex justify-end cursor-pointer"
                                onClick={() => setState(prev => ({...prev, dropdown: null, isChangeDropdown: false}))}
                            >
                                <div className="py-1 px-5 hover:bg-[rgb(249,249,249)]">
                                    Xoá lựa chọn
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {type_answer === 'paragraph' && (
                    <div className="w-full">
                        <textarea
                            onInput={onInput}
                            placeholder="Câu trả lời của bạn"
                            className="outline-none text-sm py-2 h-[40px] w-full resize-none border-b border-solid border-[rgb(239,239,239)]"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Question;