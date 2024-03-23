import { USER_LOGIN, CLEAR, FORM_SELECTED } from './constants';

export const userPackage = (user) => ({
    type: USER_LOGIN,
    payload: user,
});

export const formPackage = (form) => ({
    type: FORM_SELECTED,
    payload: form,
});

// remove all state of a reducer
export const clear = () => ({
    type: CLEAR,
})