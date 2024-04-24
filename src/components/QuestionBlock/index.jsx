import React, { useEffect, useState } from "react";

import { Upload, Select, Switch, Tooltip, Spin, InputNumber } from 'antd';

import Paragraph from "@components/Paragraph";
import MultipleChoice from "@components/MultipleChoice";
import Dropdown from "@components/Dropdown";

import IconImage from '@icon/iconImage.svg';
import IconTrash from '@icon/iconTrash.svg';
import IconCopy from '@icon/iconCopy.svg';
import IconPlus from '@icon/iconPlus.svg';

import './style.css';

const QuestionBlock = (props) => {

    const { question, isScroll, isTinhDiem } = props;
    const { handleAddBlock, onChangeQuestionTitle, handleChangeType, handleRequire, handleUploadQuestionImage, handleRemoveAnswer } = props;
    const { handleChangeAnswerIndex, handleImageAnwer, handleDeleteImageAnswer, handleInputClickAnswer, handleRemoveBlock, handleCopyBlock } = props;
    const { handleRemoveQuestionImage, onChooseAnswer, handleRemoveDapAn, handleDisbale, handleChangeDiem } = props;

    const [state, setState] = useState({
        isLoading: true,
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

    useEffect(() => {
        const element = document.getElementById(question._id);
        if (element && isScroll) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
    },[question._id]);

    const getBase64 = (file) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
    });

    const onInput = (e, isInit) => {
        const element = isInit ? e : e.target;
        if (element.value.trim() === '') {
            element.style.height = '57px';
        } else {
            element.style.height = `${element.scrollHeight}px`;
        };
    };

    useEffect(() => {
        const textareas = document.querySelectorAll('#question-title');
        textareas.forEach((textarea) => {
            onInput(textarea, true);
        });
    }, []); 

    const onUploadChange = async (event) => {
        const file = event.file;
        const url = await getBase64(file.originFileObj);
        handleUploadQuestionImage(file.originFileObj, question._id);
    };

    const renderAnswer = () => {
        switch (question.type_answer) {
            case 'paragraph':
                return <Paragraph />;
            case 'multiple-choice':
                return (
                    <MultipleChoice
                        questionId={question._id}
                        answer={question.answer}
                        type={question.type_answer}
                        dap_an={question?.dap_an}
                        handleRemoveAnswer={handleRemoveAnswer}
                        handleChangeAnswerIndex={handleChangeAnswerIndex}
                        handleImageAnwer={handleImageAnwer}
                        handleDeleteImageAnswer={handleDeleteImageAnswer}
                        handleInputClickAnswer={handleInputClickAnswer}
                        onChooseAnswer={onChooseAnswer}
                        handleRemoveDapAn={handleRemoveDapAn}
                    />
                );
            case 'choice':
                return (
                    <MultipleChoice
                        questionId={question._id}
                        answer={question.answer}
                        type={question.type_answer}
                        dap_an={question?.dap_an}
                        handleRemoveAnswer={handleRemoveAnswer}
                        handleChangeAnswerIndex={handleChangeAnswerIndex}
                        handleImageAnwer={handleImageAnwer}
                        handleDeleteImageAnswer={handleDeleteImageAnswer}
                        handleInputClickAnswer={handleInputClickAnswer}
                        onChooseAnswer={onChooseAnswer}
                        handleRemoveDapAn={handleRemoveDapAn}
                    />
                );
            case 'dropdown':
                return (
                    <Dropdown
                        questionId={question._id}
                        answer={question.answer}
                        handleInputClickAnswer={handleInputClickAnswer}
                        handleChangeAnswerIndex={handleChangeAnswerIndex}
                        handleRemoveAnswer={handleRemoveAnswer}
                    />
                )
            default:
                return (
                    <MultipleChoice
                        questionId={question._id}
                        answer={question.answer}
                        type={question.type_answer}
                        dap_an={question?.dap_an}
                        handleRemoveAnswer={handleRemoveAnswer}
                        handleChangeAnswerIndex={handleChangeAnswerIndex}
                        handleImageAnwer={handleImageAnwer}
                        handleDeleteImageAnswer={handleDeleteImageAnswer}
                        handleInputClickAnswer={handleInputClickAnswer}
                        onChooseAnswer={onChooseAnswer}
                        handleRemoveDapAn={handleRemoveDapAn}
                    />
                );
        };
    };

    const onLoad = (e) => {
        state.isLoading = false;
        setState(prev => ({...prev}));
    };

    return (
        <div
            id={question._id}
            className="bg-white w-full min-h-fit max-h-fit rounded-lg border-[1px] flex flex-col px-8 py-4 gap-5"
        >
            <div className="w-full flex flex-col md:flex-row gap-10">
                <textarea
                    value={question.title}
                    onInput={onInput} 
                    id="question-title"
                    placeholder="Câu hỏi"
                    className="w-full md:w-[400px] tracking-wide min-h-[57px] overflow-hidden max-w-[400px] border-b text-lg outline-none resize-none placeholder: text-opacity-70 placeholder:tracking-wider"
                    onChange={(e) => onChangeQuestionTitle(e, question._id)}
                />
                <div className="flex flex-grow gap-5">
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
                            value={question.type_answer}
                            onChange={(value) => handleChangeType(value, question._id, question.type_answer)}
                            defaultValue={typeAnswers[2].value}
                            options={typeAnswers}
                        />
                    </div>
                    {isTinhDiem && (
                        <div className="">
                            <InputNumber
                                className="w-16"
                                value={question.diem || 0}
                                min={0}
                                step={0.5}
                                onChange={(value) => handleChangeDiem(value, question._id)}
                            />
                        </div>
                    )}
                </div>
            </div>
            {question?.image_url?.length > 0 && (
                <div className="relative w-fit">
                    {state.isLoading && (
                        <Spin tip="Loading..." size="small"/>
                    )}
                    <img
                        alt="image"
                        style={{
                            width: '500px',
                        }}
                        src={question.image_url}
                        onLoad={onLoad}
                    />
                    <div className="absolute -top-5 -right-5">
                        <IconTrash
                            className="text-red-400 cursor-pointer"
                            onClick={() => handleRemoveQuestionImage(question._id)}
                        />
                    </div>
                </div>
            )}
            <div className="w-full border-b py-5">
                {renderAnswer()}
            </div>
            <div className="w-full flex flex-col items-end sm:flex-row sm:items-center py-2 justify-end gap-5">
                <div className="flex items-center gap-5">
                    <Tooltip
                        placement="bottom"
                        title="Sao chép câu hỏi"
                        arrow={false}
                        color="#9b9b9b"
                    >
                        <IconCopy
                            className="cursor-pointer"
                            onClick={() => handleCopyBlock(question._id)}
                        />
                    </Tooltip>
                    <Tooltip
                        placement="bottom"
                        title="Xóa câu hỏi"
                        arrow={false}
                        color="#9b9b9b"
                    >
                        <IconTrash
                            className="cursor-pointer"
                            onClick={() => handleRemoveBlock(question._id)}
                        />
                    </Tooltip>
                    <Tooltip
                        placement="bottom"
                        title="Thêm câu hỏi"
                        arrow={false}
                        color="#9b9b9b"
                    >
                        <IconPlus
                            className="cursor-pointer scale-75"
                            onClick={() => handleAddBlock(question._id)}
                        />
                    </Tooltip>
                </div>
                <div className="h-8 hidden sm:block w-[1px] bg-[rgb(218,220,224)]"></div>
                <div className="flex items-center gap-2">
                    Ẩn câu hỏi
                    <Switch
                        value={question?.isHide}
                        className="bg-[rgb(140,140,140)]"
                        onChange={(value) => handleDisbale(value, question._id)}
                    />
                </div>
                <div className="h-8 hidden sm:block w-[1px] bg-[rgb(218,220,224)]"></div>
                <div className="flex items-center gap-2">
                    Bắt buộc
                    <Switch
                        value={question.isRequire}
                        className="bg-[rgb(140,140,140)]"
                        onChange={(value) => handleRequire(value, question._id)}
                    />
                </div>
            </div>
        </div>
    );
};

export default QuestionBlock;