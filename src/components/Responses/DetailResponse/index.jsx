import React, { useState, useEffect } from "react";

import { Image as Img, Button } from 'antd';

import { useDispatch } from "react-redux";
import { printPackage } from "@core/redux/actions";
import { useNavigate } from "react-router-dom";

import IconBack from '@icon/iconBack.svg';
import IconQuestion from '@icon/iconQuestions.svg';
import IconArrowRight from '@icon/iconArrowRight.svg';
import { errImg } from '@images/errorImg';
import IconPrint from '@icon/iconPrint.svg';

import useWindowSize from "../../../hooks/useWindowSize";

import './styles.css';

const DetailResponse = (props) => {

    const { detailUser, detailAnswer, handleNavigateBack } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [visible, setVisible] = useState(false);
    const [state, setState] = useState({
        mark: 0,
    });

    const iw = useWindowSize().width;

    useEffect(() => {
        const element = document.getElementById('cccd-img');

        if (iw > 768) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }

    },[iw]);

    useEffect(() => {
        if (detailAnswer.length === 0) return;

        let count = 0;
        for (let i = 0; i < detailAnswer.length; i++) {
            if (detailAnswer[i].dap_an === detailAnswer[i].tra_loi) {
                count++;
            };
        };

        state.mark = count;
        setState(prev => ({...prev}));
    },[detailAnswer]);

    const handleNavigatePrint = () => {
        const data = {
            user: detailUser,
            answer: detailAnswer,
            mark: state.mark,
        };

        dispatch(printPackage(data));
        navigate({pathname:'/print'});
    };

    return (
        <div className="w-full h-[84vh] pt-5 flex flex-col gap-5">
            <div className="flex flex-col justify-center gap-3 w-full relative">
                <div className="flex items-center gap-3 w-full">
                    <IconBack
                        className="cursor-pointer"
                        onClick={handleNavigateBack}
                    />
                    <div className="text-base font-semibold flex flex-col md:flex-row">
                        <span>{`${detailUser?.assignee?.name} `}</span>
                        <span className="hidden md:block">&nbsp;-&nbsp;</span>
                        <span>{` ${detailUser?.assignee?.cccd}`}</span>
                    </div>
                </div>
                <div className="flex tracking-wider font-medium text-base items-center gap-1">
                        <span>{`Điểm: `}</span>
                        <span className="text-green-500">{`${state.mark} `}</span>
                        <span className="hidden md:block">/</span>
                        <span className="text-blue-500">{` ${detailAnswer.length}`}</span>
                </div>
                <div className="absolute top-3 right-0">
                    <div className="w-[200px] h-[150px] flex justify-end">
                        <Button className="md:hidden bg-[rgb(103,58,183)]" type="primary" onClick={() => setVisible(true)}>
                            CCCD
                        </Button>
                        <Img
                            id="cccd-img"
                            className="!h-full rounded-md"
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
                    <div className="w-[200px] flex justify-end mt-3">
                        <IconPrint
                            className="cursor-pointer"
                            onClick={handleNavigatePrint}
                        />
                    </div>
                </div>
            </div>
            <div className="w-full md:w-[70%] flex flex-col gap-5 flex-grow overflow-y-auto">
                {detailAnswer.map((item, index) => {
                    return (
                        <div className="flex flex-col gap-3" key={`detail-answer-${index}`}>
                            <div className="flex items-start gap-3 font-semibold">
                                <div className="w-[20px] h-[20px]">
                                    <IconQuestion />
                                </div>
                                {item.cau_hoi}
                            </div>
                            <div className="flex ml-3 items-start gap-3">
                                <div className="w-[20px]">
                                    <IconArrowRight />
                                </div>
                                <div className={`italic text-sm ${item.dap_an !== item.tra_loi ? 'text-red-500' : ''}`}>
                                    {item.cau_tra_loi}
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