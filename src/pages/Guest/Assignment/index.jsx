import React, { useState, useEffect } from "react";

import { Radio, Button, message } from 'antd';

import { v4 as uuidv4 } from 'uuid';

import { fireStore } from "@core/firebase/firebase";
import { storage2 } from "@core/firebase/firebase-image";
import { doc, collection, setDoc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { useAssigneePackageHook } from "@core/redux/hooks";

import Question from "./Question";
import { logErrorToFirestore } from "@utils/function";

const Assignment = (props) => {

    const { form, infoQuestion, handleEnd } = props;
    const assignee = useAssigneePackageHook();

    const [state, setState] = useState({
        isInfo: null,
        infoBooleanChange: false,
        answers: new Array(form?.questions?.length || 1).fill(null),
        isDisableBtn: false,
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

    const handleUploadCCCD = async (url) => {
        if (!url) return;
        const imageRef = ref(storage2, `images/${url.uid}`);
        try {
            const snapshot = await uploadBytes(imageRef, url);
            const downloadUrl = await getDownloadURL(imageRef);
            return downloadUrl;
        } catch (error) {
            console.error('Error handling CCCD upload:', error);
            throw error;
        }
    };

    const unixTimeToDateString = (unixTime) => {
        var date = new Date(unixTime * 1000);
    
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');

        var dateString = year + '-' + month + '-' + day;
    
        return dateString;
    }

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
        
        state.isDisableBtn = true;
        setState(prev => ({...prev}));
        
        try {
            const cccd_font_pic = await handleUploadCCCD(assignee.cccd_font_pic);
            
            const user_answer = {
                ...assignee,
                cccd_font_pic: cccd_font_pic || '',
            };
            
            const rs = {
                _id: uuidv4(),
                formId: form?._id,
                answers: state.answers, 
                assignee: user_answer,
                modified_at: Math.floor(new Date().getTime() / 1000)
            };
            
            const date = unixTimeToDateString(Math.floor(new Date().getTime() / 1000))

            const answerData = {
                answerId: rs?._id,
                formId: form?._id,
                assignee: user_answer,
            };

            const answerRef = doc(collection(fireStore, 'answer-new'), date);
            const docRef = doc(collection(fireStore, 'single_answer'), rs._id);

            const docSnapshot = await getDoc(answerRef);
            if (!docSnapshot.exists()) {
                await setDoc(answerRef, {
                    date: date,
                    lists: [answerData],
                });
            } else {
                await updateDoc(answerRef, {
                    lists: arrayUnion(answerData),
                });
            };

            await setDoc(docRef, rs);
            message.success('Send answer successfully', 3);
            handleEnd();
        } catch (error) {
            const errorMessage = `Error when sending answer: ${error}`;
            await logErrorToFirestore(errorMessage);
            state.isDisableBtn = false;
            setState(prev => ({...prev}));
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
                    disabled={state.isDisableBtn}
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