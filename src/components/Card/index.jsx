import React, { useState } from "react";

import { Dropdown, Popover } from 'antd';

import IconForm from '@icon/iconForm.svg';
import IconMore from '@icon/iconMore.svg';
import IconTitle from '@icon/iconTitle.svg';
import IconTrash from '@icon/iconTrash.svg';
import IconNewTab from '@icon/iconNewTab.svg';

const Card = () => {

    const [state, setState] = useState({
        isOpenContextMenu: false,
    });

    const contextMenu = [
        {
            label: 'Rename',
            key: '1',
            icon: <IconTitle />,
        },
        {
            label: 'Remove',
            key: '2',
            icon: <IconTrash />
        },
        {
            label: 'Open in new tab',
            key: '3',
            icon: <IconNewTab />
        },
    ];

    const onOpenChange = (status) => {
        state.isOpenContextMenu = status;
        setState(prev => ({...prev}));
    };

    return (
        <Dropdown
            menu={{items: contextMenu}}
            trigger={['contextMenu']}
        >
            <div className="w-[210px] h-[246px] form-card border cursor-pointer rounded-md hover:border-[rgb(196,152,232)] flex flex-col">
                <div className="w-full h-[169px] border-b"></div>
                <div className="flex flex-col w-full p-3">
                    <div className="font-medium text-sm">Mẫu không có tiêu đề</div>
                    <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <IconForm className="transform scale-75"/>
                            <div className="text-xs">Opened 5:14 PM</div>
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
            </div>
        </Dropdown>
    );
};

export default Card;