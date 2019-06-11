import { combineReducers } from 'redux'

let initState = {
    ListToken: []
}
export const Get_All_Token = (state = initState, action) => {
    switch (action.type) {
        case 'REFRESH_TOKEN':
            return {
                ListToken: action.payload
            }
        default:
            return state;
    }
}

export default combineReducers({
    Get_All_Token
})