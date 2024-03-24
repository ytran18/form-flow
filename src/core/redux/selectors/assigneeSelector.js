export const selectAssigneeReducer = (state) => {
    return state.assigneeReducer;
};

export const assigneePackageSelector = (state) => {
    return selectAssigneeReducer(state).assignee;
};