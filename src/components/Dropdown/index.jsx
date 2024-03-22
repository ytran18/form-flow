import React, { useState, useEffect } from "react";

import IconClose from '@icon/iconClose.svg';

const Dropdown = () => {

    const [state, setState] = useState({
        answer: [],
    });

    useEffect(() => {
        const defaultValue = [
            {
                value: 1,
                label: 'Option 1',
            },
            {
                value: 2,
                label: 'Add option',
            },
        ];
        state.answer = defaultValue;
        setState(prev => ({...prev}));
    },[]);

    const handleChangeInput = (e, value) => {
        const index = state.answer.findIndex(item => item.value === value);
        state.answer[index].label = e.target.value;
        setState(prev => ({...prev}));
    };

    const handleInputClick = (label) => {
        if (label !== 'Add option') return;

        const { answer } = state;

        const newAnswer = {
            value: answer.length,
            label: `Option ${answer.length}`,
        };
        
        answer.splice(answer.length - 1, 0, newAnswer);
        state.answer = answer;
        setState(prev => ({...prev}));
    };

    const handleRemoveAnswer = (value) => {
        const index = state.answer.findIndex(item => item.value === value);
        state.answer.splice(index, 1);
        setState(prev => ({...prev}));
    };

    return (
        <div className="w-full flex flex-col gap-5">
            {state.answer.length > 0 && state.answer.map((item, index) => {
                return (
                    <div key={`dropdown-${index}`} className="flex items-center gap-5">
                        <div className="text-base">{`${index + 1}.`}</div>
                        <input
                            type="text"
                            onClick={() => handleInputClick(item.label)}
                            defaultValue={item.label !== 'Add option' ? item.label : ''}
                            placeholder={item.label === 'Add option' ? 'Add option' : ''}
                            value={item.label !== 'Add option' ? state.answer[index].label : ''}
                            onChange={(e) => handleChangeInput(e, item.value)}
                            className={`outline-none w-full py-2 ${item.label === 'Add option' ? 'opacity-55' : ''}`}
                        />
                        {item.label !== 'Add option' && (
                            <IconClose
                                className="scale-125 cursor-pointer"
                                onClick={() => handleRemoveAnswer(item.value)}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    );
};

export default Dropdown;