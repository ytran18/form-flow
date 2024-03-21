import { USER_LOGIN, CLEAR } from './constants';

export const userPackage = (user) => ({
    type: USER_LOGIN,
    payload: user,
});

// remove all state of a reducer
export const clear = () => ({
    type: CLEAR,
})