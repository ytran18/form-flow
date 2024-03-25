import React from "react";

const NotAvailable = (props) => {

    const {formTitle  } = props;

    return (
        <div className="bg-white rounded-lg min-h-[136px] max-h-fit w-full border-[1px] flex flex-col gap-3">
            <div className="w-full h-[10px] bg-[rgb(103,58,183)] rounded-tl-lg rounded-tr-lg"></div>
            <div className="px-5">
                <div className="text-3xl">{formTitle}</div>
            </div>
            <div className="px-5">
                <div className="text-sm">{`Biểu mẫu ${formTitle} không còn chấp nhận phản hồi.`}</div>
            </div>
            <div className="px-5">
                <div className="text-sm">Hãy thử liên hệ với chủ sở hữu của biểu mẫu nếu bạn cho rằng đây là một sự nhầm lẫn.</div>
            </div>
        </div>
    );
};

export default NotAvailable;