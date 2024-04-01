import React from "react";

import QuestionBlock from "@components/QuestionBlock";

import { Tooltip } from "antd";

import IconPlus from '@icon/iconPlus.svg';

const Questions = (props) => {

    const { questions, formTitle, formDescription, isScroll } = props;
    const { handleAddBlock, onChangeQuestionTitle, handleChangeType, onChangeFormTitle, onChangeFormDescription, handleRequire } = props;
    const { handleUploadQuestionImage, handleChangeAnswerIndex, handleRemoveAnswer, handleImageAnwer, handleDeleteImageAnswer } = props;
    const { handleInputClickAnswer, handleCopyBlock, handleRemoveBlock, handleRemoveQuestionImage, onChooseAnswer, handleRemoveDapAn } = props;

    const onInput = (e) => {
        const element = e.target;
        if (element.value.trim() === '') {
            element.style.height = '50px';
        } else {
            element.style.height = `${element.scrollHeight}px`;
        };
    };

    return (
        <div id="preview-img" className="w-full h-full flex flex-col gap-5">
            <div className="bg-white rounded-lg min-h-[136px] max-h-fit w-full border-[1px] flex flex-col gap-3">
                <div className="w-full h-[10px] bg-[rgb(103,58,183)] rounded-tl-lg rounded-tr-lg"></div>
                <div className="px-5">
                    <input
                        value={formTitle}
                        placeholder="Form title"
                        onChange={onChangeFormTitle}
                        className="outline-none border-none text-3xl w-full"
                    />
                </div>
                <div className="px-5">
                    <textarea
                        value={formDescription}
                        onInput={onInput}
                        onChange={onChangeFormDescription}
                        placeholder="Form description"
                        className="outline-none border-none w-full resize-none"
                    />
                </div>
            </div>
            {questions.map((item) => {
                return (
                    <div className="w-full pb-3" key={`question-${item._id}`}>
                        <QuestionBlock
                            question={item}
                            isScroll={isScroll}
                            handleAddBlock={handleAddBlock}
                            onChangeQuestionTitle={onChangeQuestionTitle}
                            handleChangeType={handleChangeType}
                            handleRequire={handleRequire}
                            handleUploadQuestionImage={handleUploadQuestionImage}
                            handleChangeAnswerIndex={handleChangeAnswerIndex}
                            handleRemoveAnswer={handleRemoveAnswer}
                            handleImageAnwer={handleImageAnwer}
                            handleDeleteImageAnswer={handleDeleteImageAnswer}
                            handleInputClickAnswer={handleInputClickAnswer}
                            handleRemoveBlock={handleRemoveBlock}
                            handleCopyBlock={handleCopyBlock}
                            handleRemoveQuestionImage={handleRemoveQuestionImage}
                            onChooseAnswer={onChooseAnswer}
                            handleRemoveDapAn={handleRemoveDapAn}
                        />
                    </div>
                )
            })}
            {questions.length === 0 && (
                <div className="w-full flex items-center justify-center">
                    <Tooltip
                        placement="bottom"
                        title="Add question"
                        arrow={false}
                        color="#9b9b9b"
                    >
                        <div className="p-2 bg-white rounded-full cursor-pointer hover:scale-105 duration-300 shadow-lg">
                            <IconPlus
                                className="scale-75"
                                onClick={handleAddBlock}
                            />
                        </div>
                    </Tooltip>
                </div>
            )}
        </div>
    );
};

export default Questions;