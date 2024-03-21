import React, { useState } from "react";

import QuestionBlock from "@components/QuestionBlock";

const Questions = () => {

    const [state, setState] = useState({
        formTitle: 'Untitled form',
        formDescription: '',
    });

    const onInput = (e) => {
        const element = e.target;
        if (element.value.trim() === '') {
            element.style.height = '50px';
        } else {
            element.style.height = `${element.scrollHeight}px`;
        };
}

    return (
        <div className="w-full h-full flex flex-col gap-5">
            <div className="bg-white rounded-lg min-h-[136px] max-h-fit w-full border-[1px] flex flex-col gap-3">
                <div className="w-full h-[10px] bg-[rgb(103,58,183)] rounded-tl-lg rounded-tr-lg"></div>
                <div className="px-5">
                    <input
                        value={state.formTitle}
                        placeholder="Form title"
                        onChange={(e) => setState(prev => ({...prev, formTitle: e.target.value}))}
                        className="outline-none border-none text-3xl w-full"
                    />
                </div>
                <div className="px-5">
                    <textarea
                        value={state.formDescription}
                        onInput={onInput}
                        onChange={(e) => setState(prev => ({...prev, formDescription: e.target.value}))}
                        placeholder="Form description"
                        className="outline-none border-none w-full resize-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default Questions;