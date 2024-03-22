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
        isRequire: false,
    });

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
        };

        state.questions = [item];
        setState(prev => ({...prev}));
    },[]);

    const handleAddBlock = (blockId) => {
        const newItem = {
            _id: uuidv4(),
            title: '',
            image_url: '',
            type_answer: 'choice',
            answer: [],
            textAnswer: '',
        };
    
        const updatedQuestions = [...state.questions];
        const currBlockIndex = updatedQuestions.findIndex(item => item._id === blockId);
        updatedQuestions.splice(currBlockIndex + 1, 0, newItem);
        state.questions = updatedQuestions;
        setState(prev => ({...prev}));
    };

    const onChangeFormTitle = (event) => {
        state.formTitle = event.target.value;
        setState(prev => ({...prev}));
    };

    const onChangeFormDescription = (event) => {
        state.formDescription = event.target.value;
        setState(prev => ({...prev}));
    };

    const onChangeQuestionTitle = (event, id) => {
        const index = state.questions.findIndex(item => item._id === id);
        state.questions[index].title = event.target.value;
        setState(prev => ({...prev}));
    };

    const handleChangeType = (value, id) => {
        const index = state.questions.findIndex(item => item._id === id);
        console.log(state.questions[index], value);
        state.questions[index].type_answer = value;
        setState(prev => ({...prev}));
    };

    const handleRequire = (value) => {
        state.isRequire = value;
        setState(prev => ({...prev}));
    };

    const handleUploadQuestionImage = (url, id) => {
        const index = state.questions.findIndex(item => item._id === id);
        state.questions[index].image_url = url;
        setState(prev => ({...prev}));
    };

    const handleChangeAnswerIndex = (e, value, id) => {
        const index = state.questions.findIndex(item => item._id === id);
        const indexAnswer = state.questions[index].answer.findIndex(item => item.value === value);
        state.questions[index].answer[indexAnswer].label = e.target.value;
        setState(prev => ({...prev}));
    };

    const handleRemoveAnswer = (value, id) => {
        const index = state.questions.findIndex(item => item._id === id);
        const indexAnswer = state.questions[index].answer.findIndex(item => item.value === value);
        state.questions[index].answer.splice(indexAnswer, 1);
        setState(prev => ({...prev}));
    };

    const handleImageAnwer = (url, id, value) => {
        const index = state.questions.findIndex(item => item._id === id);
        const indexAnswer = state.questions[index].answer.findIndex(item => item.value === value);
        state.questions[index].answer[indexAnswer].img_url = url;
        setState(prev => ({...prev}));
    };

    const handleDeleteImageAnswer = (value, id) => {
        const index = state.questions.findIndex(item => item._id === id);
        const indexAnswer = state.questions[index].answer.findIndex(item => item.value === value);
        state.questions[index].answer[indexAnswer].img_url = '';
        setState(prev => ({...prev}));
    };

    const handleInputClickAnswer = (id) => {
        const newAnswer = {
            value: state.questions[id].answer.length,
            label: `Option ${state.questions[id].answer.length}`,
            img_url: '',
        };

        const index = state.questions.findIndex(item => item._id === id);
        state.questions[index].answer.splice(answer.length - 1, 0, newAnswer);
        setState(prev => ({...prev}));
    }

    const tabContent = [
        {
            label: 'Questions',
            key: '1',
            children: (
                <Questions
                    questions={state.questions}
                    formTitle={state.formTitle}
                    isRequire={state.isRequire}
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