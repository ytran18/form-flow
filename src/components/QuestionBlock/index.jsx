import React, { useState } from "react";

import { Upload, Select } from 'antd';

import Paragraph from "@components/Paragraph";
import Choice from "@components/Choice";
import MultipleChoice from "@components/MultipleChoice";
import Dropdown from "@components/Dropdown";

import IconImage from '@icon/iconImage.svg';
import IconTrash from '@icon/iconTrash.svg';

const QuestionBlock = () => {

    const [state, setState] = useState({
        img_url: '',
        typeAnswer: '',
    });

    const typeAnswers = [
        {
            value: 'paragraph',
            label: 'Paragraph',
        },
        {
            value: 'multiple-choice',
            label: 'Multiple choice',
        },
        {
            value: 'choice',
            label: 'Choice',
        },  
        {
            value: 'dropdown',
            label: 'Dropdown',
        },  
    ];

    const getBase64 = (file) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
    });

    const onInput = (e) => {
        const element = e.target;
        if (element.value.trim() === '') {
            element.style.height = '57px';
        } else {
            element.style.height = `${element.scrollHeight}px`;
        };
    };

    const onUploadChange = async (event) => {
        const file = event.file;
        const url = await getBase64(file.originFileObj);
        state.img_url = url;
        setState(prev => ({...prev}));
    };

    const renderAnswer = () => {
        switch (state.typeAnswer) {
            case 'paragraph':
                return <Paragraph />;
            case 'multiple-choice':
                return <MultipleChoice />;
            case 'choice':
                return <Choice />;
            case 'dropdown':
                return <Dropdown />;
            default:
                return <Choice />;
        };
    };

    return (
        <div className="bg-white w-full min-h-fit max-h-fit rounded-lg border-[1px] flex flex-col px-8 py-4 gap-5">
            <div className="w-full flex gap-10">
                <textarea
                    onInput={onInput}
                    placeholder="Question"
                    className="w-[400px] tracking-wide min-h-[57px] max-w-[400px] border-b text-lg outline-none resize-none placeholder: text-opacity-70 placeholder:tracking-wider"
                />
                <div className="flex">
                    <Upload
                        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        listType="picture"
                        showUploadList={false}
                        onChange={onUploadChange}
                    >
                        <IconImage className="cursor-pointer"/>
                    </Upload>
                </div>
                <div className="flex-grow">
                    <Select
                        className="w-full"
                        onChange={(value) => setState(prev => ({...prev, typeAnswer: value}))}
                        defaultValue={typeAnswers[2].value}
                        options={typeAnswers}
                    />
                </div>
            </div>
            {state.img_url.length > 0 && (
                <div className="relative">
                    <img
                        alt="image"
                        style={{
                            width: '100%',
                        }}
                        src={state.img_url}
                    />
                    <div className="absolute -top-5 -right-5">
                        <IconTrash
                            className="text-red-400 cursor-pointer"
                            onClick={() => setState(prev => ({...prev, img_url: ''}))}
                        />
                    </div>
                </div>
            )}
            <div className="w-full">
                {renderAnswer()}
            </div>
        </div>
    );
};

export default QuestionBlock;