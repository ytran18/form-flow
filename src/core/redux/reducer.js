import { CLEAR, USER_LOGIN } from "./constants";


const userState = {
    user: {},
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