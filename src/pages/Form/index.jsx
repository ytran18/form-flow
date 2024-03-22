import React, { useState, useEffect } from "react";

import { Tabs } from 'antd';

import { v4 as uuidv4 } from "uuid";

import FormHeader from "@components/FormHeader";
import Questions from "@components/Questions";
import Responses from "@components/Responses";
import Settings from "@components/Settings";

import './style.css';

const Form = () => {

    const [state, setState] = useState({
        formTitle: 'Untitled form',
        formDescription: '',
        questions: [],
    });

    // init question
    useEffect(() => {

        const defaultAnswer = [
            { value: 1, label: 'Option 1', img_url: '' },
            { value: 2, label: 'Add option', img_url: ''},
        ];

        const item = {
            _id: uuidv4(),
            title: '',
            image_url: '',
            type_answer: 'choice',
            answer: defaultAnswer,
            textAnswer: '',
            isRequire: false,
        };

        state.questions = [item];
        setState(prev => ({...prev}));
    },[]);

    // handle add block
    const handleAddBlock = (blockId) => {
        const defaultAnswer = [
            { value: 1, label: 'Option 1', img_url: '' },
            { value: 2, label: 'Add option', img_url: ''},
        ];

        const newItem = {
            _id: uuidv4(),
            title: '',
            image_url: '',
            type_answer: 'choice',
            answer: defaultAnswer,
            textAnswer: '',
        };

        if (!blockId) {
            state.questions.push(newItem);
            setState(prev => ({...prev}));
            return;
        };
    
        const updatedQuestions = [...state.questions];
        const currBlockIndex = updatedQuestions.findIndex(item => item._id === blockId);
        updatedQuestions.splice(currBlockIndex + 1, 0, newItem);
        state.questions = updatedQuestions;
        setState(prev => ({...prev}));
    };

    // change form title
    const onChangeFormTitle = (event) => {
        state.formTitle = event.target.value;
        setState(prev => ({...prev}));
    };

    // change form description
    const onChangeFormDescription = (event) => {
        state.formDescription = event.target.value;
        setState(prev => ({...prev}));
    };

    // change question title
    const onChangeQuestionTitle = (event, id) => {
        const index = state.questions.findIndex(item => item._id === id);
        state.questions[index].title = event.target.value;
        setState(prev => ({...prev}));
    };

    // change question type
    const handleChangeType = (value, id) => {
        const index = state.questions.findIndex(item => item._id === id);
        state.questions[index].type_answer = value;
        setState(prev => ({...prev}));
    };

    // change question status require
    const handleRequire = (value, id) => {
        const index = state.questions.findIndex(item => item._id === id);
        state.questions[index].isRequire = value;
        setState(prev => ({...prev}));
    };

    // handle upload question image
    const handleUploadQuestionImage = (url, id) => {
        const index = state.questions.findIndex(item => item._id === id);
        state.questions[index].image_url = url;
        setState(prev => ({...prev}));
    };

    // handle change answer label
    const handleChangeAnswerIndex = (e, value, id) => {
        const index = state.questions.findIndex(item => item._id === id);
        const indexAnswer = state.questions[index].answer.findIndex(item => item.value === value);
        state.questions[index].answer[indexAnswer].label = e.target.value;
        setState(prev => ({...prev}));
    };

    // handle remove answer
    const handleRemoveAnswer = (value, id) => {
        const index = state.questions.findIndex(item => item._id === id);
        const indexAnswer = state.questions[index].answer.findIndex(item => item.value === value);
        state.questions[index].answer.splice(indexAnswer, 1);
        setState(prev => ({...prev}));
    };

    // handle upload answer image
    const handleImageAnwer = (url, id, value) => {
        const index = state.questions.findIndex(item => item._id === id);
        const indexAnswer = state.questions[index].answer.findIndex(item => item.value === value);
        state.questions[index].answer[indexAnswer].img_url = url;
        setState(prev => ({...prev}));
    };

    // handle delete answer image
    const handleDeleteImageAnswer = (value, id) => {
        const index = state.questions.findIndex(item => item._id === id);
        const indexAnswer = state.questions[index].answer.findIndex(item => item.value === value);
        state.questions[index].answer[indexAnswer].img_url = '';
        setState(prev => ({...prev}));
    };

    // handle add answer
    const handleInputClickAnswer = (id, type) => {
        const questions = [...state.questions];
        const index = questions.findIndex(item => item._id === id);

        let newAnswer = {
            value: state.questions[index].answer.length,
            label: `Option ${state.questions[index].answer.length}`,
        };

        if (type === 'choice') {
            newAnswer = {
                ...newAnswer,
                img_url: '',
            };
        };

        const answers = [...questions[index].answer];

        answers.splice(answers.length - 1, 0, newAnswer);
        state.questions[index].answer = answers;
        setState(prev => ({...prev}));
    };

    const handleRemoveBlock = (id) => {
        const index = state.questions.findIndex(item => item._id === id);
        state.questions.splice(index, 1);
        setState(prev => ({...prev}));
    };

    const handleCopyBlock = (id) => {
        const questions = [...state.questions];

        const index = questions.findIndex(item => item._id === id);
        let copyBlock = questions[index];

        let block = {
            ...copyBlock,
            _id: uuidv4(),
        };

        questions.splice(index + 1, 0, block);
        state.questions = questions;
        setState(prev => ({...prev}));
    };

    const handleRemoveQuestionImage = (id) => {
        const index = state.questions.findIndex(item => item._id === id);
        state.questions[index].image_url = '';
        setState(prev => ({...prev}));
    };

    const tabContent = [
        {
            label: 'Questions',
            key: '1',
            children: (
                <Questions
                    questions={state.questions}
                    formTitle={state.formTitle}
                    formDescription={state.formDescription}
                    onChangeFormTitle={onChangeFormTitle}
                    onChangeFormDescription={onChangeFormDescription}
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
                />
            ),
        },
        {
            label: 'Responses',
            key: '2',
            children: <Responses />,
        },
        {
            label: 'Settings',
            key: '3',
            children: <Settings />,
        }
    ];

    return (
        <div className="w-screen h-screen flex flex-col">
            <div className="h-16 min-h-16 max-h-16 w-full">
                <FormHeader />
            </div>
            <div className="flex-grow w-full overflow-y-auto">
                <Tabs
                    hideAdd
                    centered
                    rootClassName="w-full h-full"
                    items={tabContent.map((item) => {
                        return {
                            label: item.label,
                            key: item.key,
                            children: (
                                <div className="px-80 overflow-y-auto py-3 w-full h-full bg-[rgb(240,235,248)]">
                                    {item.children}
                                </div>
                            ),
                        }
                    })}
                />
            </div>
        </div>
    );
};

export default Form;