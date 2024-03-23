import React, { useState } from "react";

import { Dropdown, Popover, Modal, Input } from 'antd';

import IconForm from '@icon/iconForm.svg';
import IconMore from '@icon/iconMore.svg';
import IconTitle from '@icon/iconTitle.svg';
import IconTrash from '@icon/iconTrash.svg';
import IconNewTab from '@icon/iconNewTab.svg';

const Card = (props) => {

    const { data, handleNavigateForm } = props;

    const [state, setState] = useState({
        isOpenContextMenu: false,
        isOpenModalRename: false,
        isOpenModalRemove: false,
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

    const handleRename = (status) => {
        state.isOpenModalRename = status !== undefined ? status : true;
        state.isOpenContextMenu = false,
        setState(prev => ({...prev}));
    };
    
    const handleRemove = (status) => {
        state.isOpenModalRemove = status !== undefined ? status : true;
        state.isOpenContextMenu = false,
        setState(prev => ({...prev}));
    };
    
    const handleOpenInNewTab = () => {
        console.log('open in new tab');
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
                onClick={() => handleNavigateForm(data?._id)}
            >
                <div className="w-full h-[169px] border-b"></div>
                <div className="flex flex-col w-full p-3">
                    <div className="font-medium text-sm">{data?.formTitle || 'Untitled form'}</div>
                    <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <IconForm className="transform scale-75"/>
                            {/* <div className="text-xs">Opened 5:14 PM</div> */}
                            <div className="text-[11px]">{data?.mordified_at}</div>
                        </div>
                        <div className="p-1 hover:bg-[rgb(218,220,224)] rounded-full">
                            <Popover
                                trigger={"click"}
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
                    onOk={() => handleRename(false)}
                    onCancel={() => handleRename(false)}
                >
                    <div className="flex flex-col gap-3">
                        <div>Please enter a new name for the item:</div>
                        <Input placeholder="Enter new name"/>
                    </div>
                </Modal>
                <Modal
                    open={state.isOpenModalRemove}
                    okText="OK"
                    title="Delete form?"
                    okButtonProps={{className:"bg-[rgb(132,47,207)]"}}
                    cancelButtonProps={{className:"text-[rgb(132,47,207)]"}}
                    cancelText="Cancel"
                    onOk={() => handleRemove(false)}
                    onCancel={() => handleRemove(false)}
                >
                    <div>This item will be deleted, are you sure?</div>
                </Modal>
            </div>
        </Dropdown>
    );
};

export default Card;