import React from "react";

import QuestionBlock from "@components/QuestionBlock";

const Questions = (props) => {

    const { questions, formTitle, formDescription, isRequire } = props;
    const { handleAddBlock, onChangeQuestionTitle, handleChangeType, onChangeFormTitle, onChangeFormDescription, handleRequire } = props;
    const { handleUploadQuestionImage, handleChangeAnswerIndex, handleRemoveAnswer, handleImageAnwer, handleDeleteImageAnswer, handleInputClickAnswer } = props;

    const onInput = (e) => {
        const element = e.target;
        if (element.value.trim() === '') {
            element.style.height = '50px';
        } else {
            element.style.height = `${element.scrollHeight}px`;
        };
    };

    return (
        <div className="w-full h-full flex flex-col gap-5">
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
                            isRequire={isRequire}
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
                        />
                    </div>
                )
            })}
        </div>
    );
};

export default Questions;