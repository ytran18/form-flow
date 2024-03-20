import React from "react";

import IconForm from '@icon/iconForm.svg';
import IconMore from '@icon/iconMore.svg';

const Card = () => {
    return (
        <div className="w-[210px] h-[246px] border cursor-pointer rounded-md hover:border-[rgb(196,152,232)] flex flex-col">
            <div className="w-full h-[169px] border-b"></div>
            <div className="flex flex-col w-full p-3">
                <div className="font-medium text-sm">Mẫu không có tiêu đề</div>
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <IconForm className="transform scale-75"/>
                        <div className="text-xs">Opened 5:14 PM</div>
                    </div>
                    <div className="p-1 hover:bg-[rgb(218,220,224)] rounded-full">
                        <IconMore className="cursor-pointer"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;