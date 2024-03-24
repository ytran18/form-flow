import { CLEAR, USER_LOGIN, FORM_SELECTED, ASSIGNEE_USER } from "./constants";


const userState = {
    user: {},
};

const formState = {
    form: {},
};

const assigneeState = {
    assignee: {},
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

export const assigneeReducer = (state = assigneeState, action) =>
{
    switch (action.type)
    {
        case ASSIGNEE_USER:{
            return { ...state, assignee: action.payload }
        }
        case CLEAR:{
            return {
                assignee: {}
            }
        }
        default:
            return state
    };
};