import React from "react";

import IconClose from '@icon/iconClose.svg';

const Dropdown = (props) => {

    const { answer, questionId } = props;
    const { handleInputClickAnswer, handleChangeAnswerIndex, handleRemoveAnswer } = props;

    const handleInputClick = (label) => {
        if (label !== 'Add option') return;
        handleInputClickAnswer(questionId, 'dropdown');
    };

    return (
        <div className="w-full flex flex-col gap-5">
            {answer.length > 0 && answer.map((item, index) => {
                return (
                    <div key={`dropdown-${index}`} className="flex items-center gap-5">
                        <div className="text-base">{`${index + 1}.`}</div>
                        <input
                            type="text"
                            onClick={() => handleInputClick(item.label, item.value)}
                            defaultValue={item.label !== 'Add option' ? item.label : ''}
                            placeholder={item.label === 'Add option' ? 'Add option' : ''}
                            value={item.label !== 'Add option' ? answer[index].label : ''}
                            onChange={(e) => handleChangeAnswerIndex(e, item.value, questionId)}
                            className={`outline-none w-full py-2 ${item.label === 'Add option' ? 'opacity-55' : ''}`}
                        />
                        {item.label !== 'Add option' && (
                            <IconClose
                                className="scale-125 cursor-pointer"
                                onClick={() => handleRemoveAnswer(item.value, questionId)}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    );
};

export default Dropdown;