import React, { useEffect, useState } from "react";

import { Radio, Space, Upload } from 'antd';

import IconImage from '@icon/iconImage.svg';
import IconTrash from '@icon/iconTrash.svg';
import IconClose from '@icon/iconClose.svg';

import './style.css';

const MultipleChoice = () => {

    const [state, setState] = useState({
        answer: [],
        activeValue: 1,
    });

    useEffect(() => {
        const defaultValue = [
            {
                value: 1,
                label: 'Option 1',
                img_url: '',
            },
            {
                value: 2,
                label: 'Add option',
                img_url: '',
            },
        ];
        state.answer = defaultValue;
        setState(prev => ({...prev}));
    },[]);

    const handleChangeInput = (e, value) => {
        const index = state.answer.findIndex(item => item.value === value);
        state.answer[index].label = e.target.value;
        setState(prev => ({...prev}));
    };

    const getBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    const onUploadChange = async (event, value) => {
        const file = event.file;
        const url = await getBase64(file.originFileObj);
        const index = state.answer.findIndex(item => item.value === value);
        state.answer[index].img_url = url;
        setState(prev => ({...prev}));
    };

    const handleDeleteImage = (value) => {
        const index = state.answer.findIndex(item => item.value === value);
        state.answer[index].img_url = '';
        setState(prev => ({...prev}));
    };

    const handleInputClick = (label, value) => {
        if (label !== 'Add option') {
            state.activeValue = value;
            setState(prev => ({...prev}));
            return;
        };

        const { answer } = state;

        const newAnswer = {
            value: answer.length,
            label: `Option ${answer.length}`,
            img_url: '',
        };
        
        answer.splice(answer.length - 1, 0, newAnswer);
        state.answer = answer;
        setState(prev => ({...prev}));
    };

    const handleRemoveAnswer = (value) => {
        const index = state.answer.findIndex(item => item.value === value);
        state.answer.splice(index, 1);
        setState(prev => ({...prev}));
    };

    return (
        <div className="w-full">
            <Radio.Group className="w-full" size="large" value={null}>
                <Space className="w-full" direction="vertical">
                    {state.answer.length > 0 && state.answer.map((item, index) => (
                        <div className="w-full flex justify-center flex-col gap-5">
                            <Radio size="large" className="flex items-center" key={index} value={item.value}>
                                <input
                                    type="text"
                                    onClick={() => handleInputClick(item.label, item.value)}
                                    defaultValue={item.label !== 'Add option' ? item.label : ''}
                                    placeholder={item.label === 'Add option' ? 'Add option' : ''}
                                    value={item.label !== 'Add option' ? state.answer[index].label : ''}
                                    onChange={(e) => handleChangeInput(e, item.value)}
                                    className={`outline-none w-full py-2 ${item.label === 'Add option' ? 'opacity-55' : ''}`}
                                />
                                {(item.label !== 'Add option' && state.activeValue === item.value) && (
                                    <Upload
                                        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                        listType="picture"
                                        showUploadList={false}
                                        className="flex items-center justify-center"
                                        onChange={(e) => onUploadChange(e, item.value)}
                                    >
                                        <IconImage className="cursor-pointer"/>
                                    </Upload>
                                )}
                                {item.label !== 'Add option' && (
                                    <IconClose
                                        className="scale-125"
                                        onClick={() => handleRemoveAnswer(item.value)}
                                    />
                                )}
                            </Radio>
                            {item.img_url.length > 0 && (
                                <div className="relative">
                                    <img
                                        alt="image"
                                        style={{
                                            width: '100%',
                                        }}
                                        src={item.img_url}
                                    />
                                    <div className="absolute top-0 -right-6">
                                        <IconTrash
                                            className="text-red-400 cursor-pointer"
                                            onClick={() => handleDeleteImage(item.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </Space>
            </Radio.Group>
        </div>
    );
};

export default MultipleChoice;