import React from "react";

const End = (props) => {

    const { form } = props;

    return (
        <div className="bg-white rounded-lg min-h-[136px] max-h-fit w-full border-[1px] flex flex-col gap-3">
            <div className="w-full h-[10px] bg-[rgb(103,58,183)] rounded-tl-lg rounded-tr-lg"></div>
            <div className="px-5">
                <div className="text-3xl">{form?.formTitle}</div>
            </div>
            <div className="px-5">
                <div className="text-sm">Câu trả lời của bạn đã được ghi lại.</div>
            </div>
            <div
                className="px-5 text-xs text-blue-400 underline cursor-pointer"
                onClick={() => window.location.reload()}
            >
                Gửi ý kiến phản hồi khác
            </div>
        </div>
    );
};

export default End;