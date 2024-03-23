import { CLEAR, USER_LOGIN, FORM_SELECTED } from "./constants";


const userState = {
    user: {},
};

const formState = {
    form: {},
};

export const userReducer = (state = userState, action) =>
{
    switch (action.type)
    {
        case USER_LOGIN:{
            return { ...state, user: action.payload }
        }
        case CLEAR:{
            return {
                user: {}
            }
        }
        default:
            return state
    };
};

export const formReducer = (state = formState, action) =>
{
    switch (action.type)
    {
        case FORM_SELECTED:{
            return { ...state, form: action.payload }
        }
        case CLEAR:{
            return {
                form: {}
            }
        }
        default:
            return state
    };
};