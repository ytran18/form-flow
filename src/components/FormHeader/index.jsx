import React, { useState } from "react";

import { Button, Tooltip, Modal, message } from 'antd';

import { fireStore } from "@core/firebase/firebase";
import { doc, deleteDoc } from 'firebase/firestore';

import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { formPackage } from "@core/redux/actions";

import IconForm from '@icon/iconForm.svg';
import IconTrash from '@icon/iconTrash.svg';

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

    return(
        <div className="w-full h-full flex items-center justify-between px-8 ml:px-20">
            <div
                className="flex items-center gap-3"
                onClick={handleNavigate}
            >
                <IconForm className="cursor-pointer"/>
                <div className="font-semibold text-xl">{form?.formTitle || 'Untitled form'}</div>
            </div>
            <div className="flex items-center gap-4">

                <Tooltip
                    placement="bottom"
                    title="Delete"
                    arrow={false}
                    color="#9b9b9b"
                >
                    <IconTrash
                        className="cursor-pointer"
                        onClick={() => handleDelete(true)}
                    />
                </Tooltip>

                <Button
                    type="primary"
                    className="bg-[rgb(103,58,183)]"
                    onClick={handleSave}
                >
                    Save
                </Button>

                <Button
                    type="primary"
                    className="bg-[rgb(103,58,183)]"
                    onClick={handleSend}
                >
                    Send
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
                <div>This item will be deleted, are you sure?</div>
            </Modal>
        </div>
    );
};

export default FormHeader;