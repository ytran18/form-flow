import React, { createContext, useContext } from 'react';

const FormContext = createContext();

export const FormProvider = ({ children, form }) => {

    return (
        <FormContext.Provider value={{ form }}>
            {children}
        </FormContext.Provider>
    );
};

export const useFormContext = () => useContext(FormContext);
