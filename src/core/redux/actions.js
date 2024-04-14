import { USER_LOGIN, CLEAR, FORM_SELECTED, ASSIGNEE_USER, PRINT } from './constants';

export const userPackage = (user) => ({
    type: USER_LOGIN,
    payload: user,
});

export const formPackage = (form) => ({
    type: FORM_SELECTED,
    payload: form,
});

export const assigneePackage = (assignee) => ({
    type: ASSIGNEE_USER,
    payload: assignee,
});

export const printPackage = (print) => ({
    type: PRINT,
    payload: print,
});

// remove all state of a reducer
export const clear = () => ({
    type: CLEAR,
})