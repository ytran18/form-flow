import React, { useState, useRef } from "react";

import { Image } from 'antd';
import { useReactToPrint } from "react-to-print";

import { errImg } from '@images/errorImg';
import IconQuestion from '@icon/iconQuestions.svg';
import IconArrowRight from '@icon/iconArrowRight.svg';
import IconPrint from '@icon/iconPrint.svg';

import { usePrintPackageHook } from "@core/redux/hooks";

const Print = () => {

    const [visible, setVisible] = useState(false);
    const print = usePrintPackageHook();

    const printRef = useRef(null);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    return (
        <div className="w-[210mm] h-screen overflow-y-auto relative">
            <div className="absolute top-3 right-0">
                <IconPrint
                    className="cursor-pointer scale-125"
                    onClick={handlePrint}
                />
            </div>
            <div ref={printRef} className="w-full h-full p-6">
                <div className="flex w-full gap-5 text-lg font-semibold">
                    <div className="w-[200px]">
                        <Image
                            id="cccd-img"
                            className="w-full rounded-md"
                            src={print?.user?.assignee?.cccd_font_pic}
                            fallback={errImg}
                            preview={{
                                visible,
                                src: print?.user?.assignee?.cccd_font_pic,
                                onVisibleChange: (value) => {
                                    setVisible(value);
                                },
                            }}
                        />
                    </div>
                    <span>{`${print?.user?.assignee?.name} - ${print?.user?.assignee?.cccd}`}</span>
                </div>
                <div className="my-5 flex flex-col gap-5 w-full">
                    {Object.keys(print?.answer).map((item, index) => {
                        return (
                            <div className="flex flex-col gap-3" key={`detail-answer-${index}`}>
                                <div className="flex items-start gap-3 font-semibold">
                                    <div className="w-[20px] h-[20px]">
                                        <IconQuestion />
                                    </div>
                                    {item}
                                </div>
                                <div className="flex ml-3 items-start gap-3">
                                    <div className="w-[20px]">
                                        <IconArrowRight />
                                    </div>
                                    <div className="italic text-sm">
                                        {print?.answer[item]}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default Print;