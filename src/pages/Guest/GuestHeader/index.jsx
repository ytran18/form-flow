import React from "react";

const GuestHeader = (props) => {

    const { form } = props;

    return (
        <div className="bg-white rounded-lg min-h-[136px] max-h-fit w-full border-[1px] flex flex-col gap-3">
            <div className="w-full h-[10px] bg-[rgb(103,58,183)] rounded-tl-lg rounded-tr-lg"></div>
            <div className="px-5">
                <div className="text-3xl">{form?.formTitle}</div>
            </div>
            <div className="px-5">
                <div className="">{form?.formDescription}</div>
            </div>
        </div>
    );
};

export default GuestHeader;