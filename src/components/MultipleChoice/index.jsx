import React, { useState } from "react";

import { Radio, Space, Upload } from 'antd';

import IconImage from '@icon/iconImage.svg';
import IconTrash from '@icon/iconTrash.svg';
import IconClose from '@icon/iconClose.svg';

import './style.css';

const MultipleChoice = (props) => {

    const { answer, questionId } = props;
    const { handleRemoveAnswer, handleChangeAnswerIndex, handleImageAnwer, handleDeleteImageAnswer, handleInputClickAnswer } = props;

    const [state, setState] = useState({
        activeValue: 1,
    });

    const getBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    const onUploadChange = async (event, value) => {
        const file = event.file;
        const url = await getBase64(file.originFileObj);
        handleImageAnwer(url, questionId, value);
    };

    const handleInputClick = (label, value) => {
        if (label !== 'Add option') {
            state.activeValue = value;
            setState(prev => ({...prev}));
            return;
        };

        handleInputClickAnswer(value, questionId);
    };

    return (
        <div className="w-full">
            <Radio.Group className="w-full" size="large" value={null}>
                <Space className="w-full" direction="vertical">
                    {answer.length > 0 && answer.map((item, index) => (
                        <div className="w-full flex justify-center flex-col gap-5">
                            <Radio size="large" className="flex items-center" key={index} value={item.value}>
                                <input
                                    type="text"
                                    onClick={() => handleInputClick(item.label, item.value)}
                                    defaultValue={item.label !== 'Add option' ? item.label : ''}
                                    placeholder={item.label === 'Add option' ? 'Add option' : ''}
                                    value={item.label !== 'Add option' ? answer[index].label : ''}
                                    onChange={(e) => handleChangeAnswerIndex(e, item.value, questionId)}
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
                                        className="scale-125 cursor-pointer"
                                        onClick={() => handleRemoveAnswer(item.value, questionId)}
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
                                            onClick={() => handleDeleteImageAnswer(item.value, questionId)}
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