import React, { useState } from "react";

import { Dropdown, Popover, Modal, Input, message } from 'antd';

import { fireStore } from "@core/firebase/firebase";
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { formPackage } from "@core/redux/actions";

import IconForm from '@icon/iconForm.svg';
import IconMore from '@icon/iconMore.svg';
import IconTitle from '@icon/iconTitle.svg';
import IconTrash from '@icon/iconTrash.svg';
import IconNewTab from '@icon/iconNewTab.svg';

const Card = (props) => {

    const { data, handleNavigateForm, getData } = props;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [state, setState] = useState({
        isOpenContextMenu: false,
        isOpenModalRename: false,
        isOpenModalRemove: false,
        newName: '',
    });

    const contextMenu = [
        {
            label: 'Rename',
            key: '1',
            icon: <IconTitle />,
            onClick: () => handleRename(),
        },
        {
            label: 'Remove',
            key: '2',
            icon: <IconTrash />,
            onClick: () => handleRemove(),
        },
        {
            label: 'Open in new tab',
            key: '3',
            icon: <IconNewTab />,
            onClick: () => handleOpenInNewTab(),
        },
    ];

    const onOpenChange = (status) => {
        state.isOpenContextMenu = status;
        setState(prev => ({...prev}));
    };

    const handleRename = async (status, isSave) => {
        state.isOpenModalRename = status !== undefined ? status : true;
        state.isOpenContextMenu = false;

        if (isSave && state.newName) {
            const docRef = doc(fireStore, 'forms', data?._id);
            await updateDoc(docRef, {formTitle: state.newName});
            message.success('Rename successfully!', 3);
            getData();
        };

        setState(prev => ({...prev}));
    };
    
    const handleRemove = async (status, isDelete) => {
        state.isOpenModalRemove = status !== undefined ? status : true;
        state.isOpenContextMenu = false;

        if (isDelete) {
            const docRef = doc(fireStore, 'forms', data?._id);
            await deleteDoc(docRef);
            message.success('Delete form successfully!', 3);
            getData();
        };

        setState(prev => ({...prev}));
    };
    
    const handleOpenInNewTab = () => {
        const isDev = process.env.NODE_ENV === 'development';
        const link = isDev ? `http://localhost:5000/#/form/${data?._id}` : `https://antoanvesinhlaodong.vn/bieu-mau/#/form/${data?._id}`;

        window.open(link, '_blank');

        dispatch(formPackage(data));
        state.isOpenContextMenu = false,
        setState(prev => ({...prev}));
    };

    return (
        <Dropdown
            menu={{items: contextMenu}}
            trigger={['contextMenu']}
        >
            <div
                className="w-[210px] h-[246px] form-card border cursor-pointer rounded-md hover:border-[rgb(196,152,232)] flex flex-col"
                onClick={(e) => handleNavigateForm(e, data?._id)}
            >
                <div className="w-full h-[169px] border-b">
                    {data?.preview_img?.length > 0 && (
                        <img src={data?.preview_img} className="w-full h-full"/>
                    )}
                </div>
                <div className="flex flex-col w-full p-3">
                    <div className="font-medium text-sm truncate">{data?.formTitle || 'Untitled form'}</div>
                    <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <IconForm className="transform scale-75"/>
                            {/* <div className="text-xs">Opened 5:14 PM</div> */}
                            <div className="text-[11px]">{data?.mordified_at}</div>
                        </div>
                        <div id="context-memu-icon" className="p-1 hover:bg-[rgb(218,220,224)] rounded-full">
                            <Popover
                                trigger={"click"}
                                id="context-menu-popover"
                                open={state.isOpenContextMenu}
                                onOpenChange={onOpenChange}
                                placement="bottom"
                                content={
                                    <div className="flex flex-col">
                                        {contextMenu.map((item, index) => {
                                            return (
                                                <div
                                                    onClick={item.onClick}
                                                    className="w-full rounded-md flex items-center gap-3 hover:bg-[rgb(245,245,245)] cursor-pointer p-2"
                                                    key={`context-menu-${index}`}
                                                >
                                                    {item.icon}
                                                    <div className="">{item.label}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            >
                                <IconMore className="cursor-pointer"/>
                            </Popover>
                        </div>
                    </div>
                </div>
                <Modal
                    open={state.isOpenModalRename}
                    okText="OK"
                    title="Rename"
                    okButtonProps={{className:"bg-[rgb(132,47,207)]"}}
                    cancelButtonProps={{className:"text-[rgb(132,47,207)]"}}
                    cancelText="Cancel"
                    onOk={() => handleRename(false, true)}
                    onCancel={() => handleRename(false)}
                >
                    <div className="flex flex-col gap-3">
                        <div>Please enter a new name for the item:</div>
                        <Input
                            placeholder="Enter new name"
                            value={state.newName}
                            onChange={(e) => setState(prev => ({...prev, newName: e?.target?.value}))}
                        />
                    </div>
                </Modal>
                <Modal
                    open={state.isOpenModalRemove}
                    okText="OK"
                    title="Delete form?"
                    okButtonProps={{className:"bg-[rgb(132,47,207)]"}}
                    cancelButtonProps={{className:"text-[rgb(132,47,207)]"}}
                    cancelText="Cancel"
                    onOk={() => handleRemove(false, true)}
                    onCancel={() => handleRemove(false)}
                >
                    <div>This item will be deleted, are you sure?</div>
                </Modal>
            </div>
        </Dropdown>
    );
};

export default Card;