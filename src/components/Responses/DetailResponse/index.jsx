import React, { useState, useEffect } from "react";

import { Image as Img, Button } from 'antd';

import IconBack from '@icon/iconBack.svg';
import IconQuestion from '@icon/iconQuestions.svg';
import IconArrowRight from '@icon/iconArrowRight.svg';
import { errImg } from '@images/errorImg';

import useWindowSize from "../../../hooks/useWindowSize";

import './styles.css';

const DetailResponse = (props) => {

    const { detailUser, detailAnswer, handleNavigateBack } = props;

    const [visible, setVisible] = useState(false);

    const iw = useWindowSize().width;

    useEffect(() => {
        const element = document.getElementById('cccd-img');

        if (iw > 768) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }

    },[iw]);

    return (
        <div className="w-full h-[80vh] flex flex-col gap-10">
            <div className="flex items-center gap-3 w-full relative">
                <IconBack
                    className="cursor-pointer"
                    onClick={handleNavigateBack}
                />
                <div className="text-base font-semibold flex flex-col md:flex-row">
                    <span>{`${detailUser?.assignee?.name} `}</span>
                    <span className="hidden md:block">&nbsp;-&nbsp;</span>
                    <span>{` ${detailUser?.assignee?.cccd}`}</span>
                </div>
                <div className="absolute top-3 right-0">
                    <div className="w-[200px] h-[150px] flex justify-end">
                        <Button className="md:hidden bg-[rgb(103,58,183)]" type="primary" onClick={() => setVisible(true)}>
                            CCCD
                        </Button>
                        <Img
                            id="cccd-img"
                            className="w-full !h-full rounded-md"
                            src={detailUser?.assignee?.cccd_font_pic}
                            fallback={errImg}
                            preview={{
                                visible,
                                src: detailUser?.assignee?.cccd_font_pic,
                                onVisibleChange: (value) => {
                                    setVisible(value);
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="w-full md:w-[70%] flex flex-col gap-5 flex-grow overflow-y-auto">
                {Object.keys(detailAnswer).map((item, index) => {
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
                                    {detailAnswer[item]}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default DetailResponse;