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
                    <div className="flex flex-col gap-3">
                        <span>{`${print?.user?.assignee?.name} - ${print?.user?.assignee?.cccd}`}</span>
                        <div className="flex tracking-wider font-medium text-base items-center gap-1">
                            <span>{`Điểm: `}</span>
                            <span className="text-green-500">{`${print?.mark} `}</span>
                            <span className="hidden md:block">/</span>
                            <span className="text-blue-500">{` ${print?.answer?.length}`}</span>
                    </div>
                    </div>
                </div>
                <div className="my-5 flex flex-col gap-5 w-full">
                    {print?.answer.map((item, index) => {
                        return (
                            <div className="flex flex-col gap-3" key={`detail-answer-${index}`}>
                                <div className="flex items-start gap-3 font-semibold">
                                    <div className="w-[20px] h-[20px]">
                                        <IconQuestion />
                                    </div>
                                    {item.cau_hoi}
                                </div>
                                {item?.list_dap_an?.map((list, idx) => {
                                    return (
                                        <div className="flex ml-3 items-start gap-3" key={`list_dap_an-${idx}`}>
                                            <div className="w-[20px]">
                                                <IconArrowRight />
                                            </div>
                                            <div className={`italic text-sm ${((list.value !== item.tra_loi)) ? '' : item.tra_loi === item.dap_an ? 'text-green-500' : 'text-red-500'}`}>
                                                {list?.label}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default Print;