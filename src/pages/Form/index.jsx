import React, { useState, useEffect } from "react";

import { Tabs, Modal, message } from 'antd';

import { useNavigate, useLocation, useParams } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

import html2canvas from 'html2canvas';

import { useFormPackageHook } from "@core/redux/hooks";
import { useDispatch } from "react-redux";
import { formPackage } from '@core/redux/actions';

import { fireStore } from '@core/firebase/firebase';
import { storage2 } from "@core/firebase/firebase-image";
import { doc, collection, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import FormHeader from "@components/FormHeader";
import Questions from "@components/Questions";
import Responses from "@components/Responses";
import Settings from "@components/Settings";

import './style.css';
import { FormProvider } from "./context";

const Form = () => {

    const [state, setState] = useState({
        formTitle: 'Untitled form',
        formDescription: '',
        questions: [],
        isVisibleModalSend: false,
        isScroll: false,
        isAvailable: true,
        isTinhDiem: true,
        isVisibleModalDiscard: false,
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const form = useFormPackageHook();
    const param = useParams();

    useEffect(() => {
        if (Object.keys(form).length > 0) {
            const updatedForm = { ...form };
    
            if (updatedForm.questions) {
                updatedForm.questions = updatedForm.questions.map(item => {
                    if (item?.type_answer !== 'paragraph' && item?.answer?.[item?.answer?.length - 1]?.label !== 'Add option') {
                        const updatedAnswer = [...item.answer, { value: 99, label: 'Add option', img_url: '' }];
                        return {
                            ...item,
                            answer: updatedAnswer,
                        };
                    };
                    return item;
                });
            };

            setState(prev => ({
                ...prev,
                formTitle: updatedForm.formTitle,
                formDescription: updatedForm.formDescription,
                questions: updatedForm.questions,
                isAvailable: updatedForm.isAvailable,
                isTinhDiem: updatedForm.isTinhDiem
            }));
        }
    },[form]);

    // init question
    useEffect(() => {

        const defaultAnswer = [
            { value: 1, label: 'Option 1', img_url: '' },
            { value: 99, label: 'Add option', img_url: ''},
        ];

        const item = {
            _id: uuidv4(),
            title: '',
            image_url: '',
            type_answer: 'choice',
            dap_an: null,
            answer: defaultAnswer,
            textAnswer: '',
            isRequire: false,
            isHide: false,
            diem: 0,
        };

        state.questions = [item];
        setState(prev => ({...prev}));
    },[]);

    // handle add block
    const handleAddBlock = (blockId) => {
        const defaultAnswer = [
            { value: 1, label: 'Option 1', img_url: '' },
            { value: 99, label: 'Add option', img_url: ''},
        ];

        const newItem = {
            _id: uuidv4(),
            title: '',
            image_url: '',
            type_answer: 'choice',
            dap_an: null,
            answer: defaultAnswer,
            textAnswer: '',
            isRequire: false,
            isHide: false,
            diem: 0,
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
        state.isScroll = true;
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
    const handleChangeType = (value, id, type) => {
        const index = state.questions.findIndex(item => item._id === id);
        state.questions[index].dap_an = type === 'choice' ? null : [];
        state.questions[index].type_answer = value;
        setState(prev => ({...prev}));
    };

    // change question status require
    const handleRequire = (value, id) => {
        const index = state.questions.findIndex(item => item._id === id);
        state.questions[index].isRequire = value;
        setState(prev => ({...prev}));
    };

    // is show and hide
    const handleDisbale = (value, id) => {
        const index = state.questions.findIndex(item => item._id === id);
        state.questions[index].isHide = value;
        setState(prev => ({...prev}));
    };
    
    const handleChangeDiem = (value, id) => {
        const index = state.questions.findIndex(item => item._id === id);
        state.questions[index].diem = value;
        setState(prev => ({...prev}));
    };

    // handle bat / tat tinh diem
    const handleTinhDiem = (value) => {
        state.isTinhDiem = value;
        setState(prev => ({...prev}));
    };

    // handle upload question image
    const handleUploadQuestionImage = (url, id) => {
        const index = state.questions.findIndex(item => item._id === id);

        const imageRef = ref(storage2, `images/${url.uid}`);
        uploadBytes(imageRef, url).then(() => {
            getDownloadURL(imageRef).then(url => {
                state.questions[index].image_url = url;
                setState(prev => ({...prev}));
            });
        });
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

        const imageRef = ref(storage2, `images/${url.uid}`);
        uploadBytes(imageRef, url).then((snapshot) => {
            getDownloadURL(imageRef).then((url) => {
                state.questions[index].answer[indexAnswer].img_url = url;
                setState(prev => ({...prev}));
            });
        })
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

    const onChooseAnswer = (event, type, id) => {
        const questions = [...state.questions];
        const index = questions.findIndex(item => item._id === id);

        state.questions[index].dap_an = type === 'choice' ? event.target.value : event;
        setState(prev => ({...prev}));
    };

    const handleRemoveDapAn = (type, id) => {
        const questions = [...state.questions];
        const index = questions.findIndex(item => item._id === id);

        state.questions[index].dap_an = type === 'choice' ? null : [];
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

    const handleSend = (type) => {
        if (type === 'copy') {
            let link = `https://antoanvesinhlaodong.vn/bieu-mau/#/guest/${form?._id}`;
            if (process.env.NODE_ENV === 'development') {
                link = `http://localhost:5000/#/guest/${form?._id}`;
            };
            navigator.clipboard.writeText(link).then(() => {
                message.success("Sao chép đường dẫn thành công!")
            })
        };

        state.isVisibleModalSend = !state.isVisibleModalSend;
        setState(prev => ({...prev}));
    };

    const handleGetBlob = async () => {
        const divElement = document.getElementById('preview-img');

        const canvas = await html2canvas(divElement);

        return new Promise(resolve => {
            canvas.toBlob(function(blob) {
                resolve(blob);
            });
        });
    };

    const handleSave = async () => {
        let updatedQuestions = [...state.questions];
    
        updatedQuestions = updatedQuestions.map((item, index) => {
            if (item?.type_answer !== 'paragraph') {
                return {
                    ...item,
                    index: index + 1,
                    answer: item?.answer.slice(0, -1),
                };
            }
            return { ...item, index: index + 1 };
        });
        
        try {
            let previewURL = '';
            const blob = await handleGetBlob();
            const imageRef = ref(storage2, `images/${uuidv4()}`);
            const snapshot = await uploadBytes(imageRef, blob);
            previewURL = await getDownloadURL(imageRef);

            const rs = {
                _id: location.state === 'new' ? param.formId : form?._id,
                formTitle: state.formTitle,
                formDescription: state.formDescription,
                questions: updatedQuestions,
                mordified_at: new Date().toLocaleString(),
                preview_img: previewURL,
                isAvailable: state.isAvailable,
                isTinhDiem: state.isTinhDiem
            };

            const docRef = doc(collection(fireStore, 'forms'), rs._id);
            const updateRef = doc(fireStore, 'forms', rs._id);

            if (location.state === 'new') {
                await setDoc(docRef, rs);
            } else {
                await updateDoc(updateRef, rs);
            };

            message.success('Save form successfully', 3);
            dispatch(formPackage(rs));
        } catch (error) {
            console.log(error);
        };

    };

    const handleNavigate = () => {
        let updatedQuestions = [...state.questions];
    
        updatedQuestions = updatedQuestions.map((item, index) => {
            if (item?.type_answer !== 'paragraph') {
                return {
                    ...item,
                    index: index + 1,
                    answer: item?.answer.slice(0, -1),
                };
            }
            return { ...item, index: index + 1 };
        });

        const rs = {
            _id: location.state === 'new' ? param.formId : form?._id,
            formTitle: state.formTitle,
            formDescription: state.formDescription,
            questions: updatedQuestions,
            mordified_at: form?.mordified_at,
            preview_img: form?.preview_img,
            isAvailable: state.isAvailable,
            isTinhDiem: state.isTinhDiem
        };

        const obj = {};

        Object.keys(form).map((item) => {
            obj[item] = rs[item];
        });

        if(JSON.stringify(form) === JSON.stringify(obj)) {
            dispatch(formPackage({}));
            navigate({pathname:'/'});
        } else {
            state.isVisibleModalDiscard = true;
            setState(prev => ({...prev}));
        }
    };

    const onToggleChange = (checked) => {
        state.isAvailable = checked;
        setState(prev => ({...prev}));
    };

    const tabContent = [
        {
            label: 'Câu hỏi',
            key: '1',
            children: (
                <Questions
                    questions={state.questions}
                    formTitle={state.formTitle}
                    formDescription={state.formDescription}
                    isScroll={state.isScroll}
                    isTinhDiem={state.isTinhDiem}
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
                    onChooseAnswer={onChooseAnswer}
                    handleRemoveDapAn={handleRemoveDapAn}
                    handleDisbale={handleDisbale}
                    handleTinhDiem={handleTinhDiem}
                    handleChangeDiem={handleChangeDiem}
                />
            ),
        },
        {
            label: 'Phản hồi',
            key: '2',
            children: (
                <FormProvider form={form}>
                    <Responses
                        form={form}
                        formId={form?._id}
                        isAvailable={state.isAvailable}
                        isTinhDiem={state.isTinhDiem}
                        onToggleChange={onToggleChange}
                    />
                </FormProvider>
            )
        },
    ];

    return (
        <div className="w-screen h-screen flex flex-col">
            <div className="h-16 min-h-16 max-h-16 w-full">
                <FormHeader
                    handleSend={handleSend}
                    handleSave={handleSave}
                    handleNavigate={handleNavigate}
                    form={form}
                />
            </div>
            <div className="flex-grow w-full overflow-y-auto">
                <Tabs
                    hideAdd
                    centered
                    // defaultActiveKey="2"
                    rootClassName="w-full h-full"
                    items={tabContent.map((item) => {
                        return {
                            label: item.label,
                            key: item.key,
                            children: (
                                <div className="px-8 md:px-16 ml:px-32 lg:px-48 xl:px-80 overflow-y-auto py-3 w-full h-full bg-[rgb(240,235,248)]">
                                    {item.children}
                                </div>
                            ),
                        }
                    })}
                />
            </div>
            <Modal
                open={state.isVisibleModalSend}
                onCancel={handleSend}
                onOk={() => handleSend('copy')}
                okText="Sao chép đường dẫn"
                cancelText="Hủy"
                okButtonProps={{className: 'bg-[rgb(103,58,183)]'}}
                title="Gửi bài thi"
                className="send-form"
            >
                <div className="font-medium text-base pt-5">Đường dẫn</div>
                <div className="w-full">
                    <input
                        disabled
                        value={process.env.NODE_ENV === 'development' ? `http://localhost:5000/#/guest/${form?._id}` : `https://antoanvesinhlaodong.vn/bieu-mau/#/guest/${form?._id}`}
                        className="w-full border-b outline-none py-2"
                    />
                </div>
            </Modal>
            <Modal
                open={state.isVisibleModalDiscard}
                onCancel={() => setState(prev => ({...prev, isVisibleModalDiscard: false}))}
                onOk={() => {dispatch(formPackage({})); navigate({pathname:'/'});}}
                okText="Thoát"
                cancelText="Hủy"
                okButtonProps={{className: 'bg-[rgb(103,58,183)]'}}
                title=""
            >
                <div>Bạn có thay đổi chưa được lưu, Bạn có chắc chắn muốn thoát chứ?</div>
            </Modal>
        </div>
    );
};

export default Form;