export const selectPrintReducer = (state) => {
    return state.printReducer;
};

export const printPackageSelector = (state) => {
    return selectPrintReducer(state).print;
};