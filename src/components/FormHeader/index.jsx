import React, { useState } from "react";

import { Button, Tooltip, Modal, message } from 'antd';

import { fireStore } from "@core/firebase/firebase";
import { doc, deleteDoc, collection, setDoc } from 'firebase/firestore';

import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { formPackage } from "@core/redux/actions";

import IconForm from '@icon/iconForm.svg';
import IconTrash from '@icon/iconTrash.svg';
import IconGlobal from '@icon/iconGlobal.svg';

const FormHeader = (props) => {

    const { handleSend, handleNavigate, handleSave, form } = props;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [state, setState] = useState({
        isVisibleModalDelete: false,
    });

    const handleDelete = async (status, isDelete) => {
        state.isVisibleModalDelete = status !== undefined ? status : true;

        if (isDelete) {
            const docRef = doc(fireStore, 'forms', form?._id);
            await deleteDoc(docRef);
            dispatch(formPackage({}));
            message.success('Delete form successfully!', 3);
            navigate({pathname: '/'});
        };

        setState(prev => ({...prev}));
    };

    const handleDisplayFormInWeb = async () => {
        const link = `https://antoanvesinhlaodong.vn/bieu-mau/#/guest/${form?._id}`;
        const rs = {
            active: link
        };
        
        const docRef = doc(collection(fireStore, 'active_form'), 'data');
        await setDoc(docRef, rs);
        message.success('Đã hiện bài thi này trên web!', 3);
    };

    return(
        <div className="w-full h-full flex items-center justify-between px-8 ml:px-20">
            <div className="flex items-center gap-3 w-1/2">
                <div
                    className="w-[32px]"
                    onClick={handleNavigate}
                >
                    <IconForm className="cursor-pointer"/>
                </div>
                <div className="font-semibold text-xl truncate">{form?.formTitle || 'Untitled form'}</div>
            </div>
            <div className="flex items-center gap-4">

                <Tooltip
                    placement="bottom"
                    title="Xóa"
                    arrow={false}
                    color="#9b9b9b"
                >
                    <IconTrash
                        className="cursor-pointer"
                        onClick={() => handleDelete(true)}
                    />
                </Tooltip>

                <Tooltip
                    placement="bottom"
                    title="Hiện bài thi trên web"
                    arrow={false}
                    color="#9b9b9b"
                >
                    <IconGlobal
                        className="cursor-pointer"
                        onClick={handleDisplayFormInWeb}
                    />
                </Tooltip>

                <Button
                    type="primary"
                    className="bg-[rgb(103,58,183)]"
                    onClick={handleSave}
                >
                    Lưu
                </Button>

                <Button
                    type="primary"
                    className="bg-[rgb(103,58,183)]"
                    onClick={handleSend}
                >
                    Gửi
                </Button>

            </div>
            <Modal
                open={state.isVisibleModalDelete}
                onCancel={() => handleDelete(false)}
                onOk={() => handleDelete(false, true)}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{className: 'bg-[rgb(103,58,183)]'}}
                title="Delete form"
                className="send-form"
            >
                <div>Bài kiểm tra này sẽ bị xóa, ban chắc chứ?</div>
            </Modal>
        </div>
    );
};

export default FormHeader;