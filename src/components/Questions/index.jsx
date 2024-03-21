import React, { useState } from "react";

const Questions = () => {

    const [state, setState] = useState({
        formTitle: 'Untitled form',
        formDescription: '',
    });

    return (
        <div className="w-full h-full flex flex-col gap-5">
            <div className="bg-white rounded-lg h-[136px] w-full border-[1px] flex flex-col gap-3">
                <div className="w-full h-[10px] bg-[rgb(103,58,183)] rounded-tl-lg rounded-tr-lg"></div>
                <div className="px-5">
                    <input
                        value={state.formTitle}
                        placeholder="Form title"
                        onChange={(e) => setState(prev => ({...prev, formTitle: e.target.value}))}
                        className="outline-none border-none text-3xl"
                    />
                </div>
                <div className="px-5">
                    <input
                        value={state.formDescription}
                        onChange={(e) => setState(prev => ({...prev, formDescription: e.target.value}))}
                        placeholder="Form description"
                        className="outline-none border-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default Questions;