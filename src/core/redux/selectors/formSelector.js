export const selectFormReducer = (state) => {
    return state.formReducer;
};

export const formPackageSelector = (state) => {
    return selectFormReducer(state).form;
};