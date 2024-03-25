import React, { useState, useEffect } from "react";

import { Radio, Button, message } from 'antd';

import { v4 as uuidv4 } from 'uuid';

import { fireStore } from "@core/firebase/firebase";
import { doc, collection, setDoc } from 'firebase/firestore';

import { useAssigneePackageHook } from "@core/redux/hooks";

import Question from "./Question";

const Assignment = (props) => {

    const { form, infoQuestion, handleEnd } = props;
    const assignee = useAssigneePackageHook();

    const [state, setState] = useState({
        isInfo: null,
        infoBooleanChange: false,
        answers: new Array(form?.questions?.length || 1).fill(null),
    });

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            const confirmationMessage = 'Những thay đổi của bạn sẽ không được lưu!';
            event.returnValue = confirmationMessage;
            return confirmationMessage;
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const onChangeInfoBoolean = (event) => {
        state.isInfo = event?.target?.value;
        state.infoBooleanChange = true;
        setState(prev => ({...prev}));
    };

    const handleAnswer = (questionId, typeQuestion, answer) => {
        const questionsCopy = [...form?.questions];
        const questionIndex = questionsCopy.findIndex(element => element?._id === questionId);

        const rs = {
            questionId: questionId,
            type_question: typeQuestion,
            value: answer,
        };

        state.answers[questionIndex] = rs;
        setState(prev => ({...prev}));
    };

    const handleSend = async () => {
        if (state.isInfo === null) {
            message.error('Vui lòng trả lời đầy đủ các câu hỏi!');
            return;
        };

        for (let i = 0; i < state.answers.length; i++) {
            if ((state.answers[i]?.value === null || state.answers[i] === null) && form?.questions[i]?.isRequire) {
                message.error('Vui lòng trả lời đầy đủ các câu hỏi!');
                return;
            };
        };

        const rs = {
            _id: uuidv4(),
            formId: form?._id,
            answers: state.answers, 
            assignee: assignee,
        };
        try {
            const docRef = doc(collection(fireStore, 'answers'), rs._id);
            await setDoc(docRef, rs);
            message.success('Send answer successfully', 3);
            handleEnd();
        } catch (error) {
            console.log(error);
        };
    };

    return (
        <div className="w-full flex flex-col gap-5 mb-10">
            <div className="bg-white rounded-lg p-3 min-h-fit max-h-fit w-full border-[1px] flex flex-col gap-3">
                <div className="px-5 flex flex-col gap-5">
                    <div className="font-medium">
                        Bạn có phải là <span className="text-red-500">{infoQuestion.name}</span>,
                        sinh ngày <span className="text-red-500">{infoQuestion.birthday}</span>,
                        CCCD số <span className="text-red-500">{infoQuestion.cccd}</span> không?
                        <span className="text-red-500">{` *`}</span>
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
                            handleAnswer={handleAnswer}
                        />
                    </div>
                )
            })}
            <div className="w-full flex justify-end">
                <Button
                    type="primary"
                    className="!bg-[rgb(81,45,143)]"
                    onClick={handleSend}
                >
                    Gửi
                </Button>
            </div>
        </div>
    );
};

export default Assignment;