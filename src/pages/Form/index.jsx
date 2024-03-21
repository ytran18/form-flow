import React from "react";

import { Tabs } from 'antd';

import FormHeader from "@components/FormHeader";
import Questions from "@components/Questions";
import Responses from "@components/Responses";
import Settings from "@components/Settings";

import './style.css';

const Form = () => {

    const tabContent = [
        {
            label: 'Questions',
            key: '1',
            children: <Questions />,
        },
        {
            label: 'Responses',
            key: '2',
            children: <Responses />,
        },
        {
            label: 'Settings',
            key: '3',
            children: <Settings />,
        }
    ];

    return (
        <div className="w-screen h-screen flex flex-col">
            <div className="h-16 min-h-16 max-h-16 w-full">
                <FormHeader />
            </div>
            <div className="flex-grow w-full overflow-y-auto">
                <Tabs
                    hideAdd
                    centered
                    rootClassName="w-full h-full"
                    items={tabContent.map((item) => {
                        return {
                            label: item.label,
                            key: item.key,
                            children: (
                                <div className="px-80 overflow-y-auto py-3 w-full h-full bg-[rgb(240,235,248)]">
                                    {item.children}
                                </div>
                            ),
                        }
                    })}
                />
            </div>
        </div>
    );
};

export default Form;