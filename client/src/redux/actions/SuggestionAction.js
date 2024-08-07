import { getDataAPI } from "../../utils/FetchData"
import { GLOBALTYPES } from "../GlobalTypes"


export const SUGGES_TYPES = {
    LOADING: 'LOADING_SUGGES',
    GET_USERS: 'GET_USERS_SUGGES',
}

export const getSuggestions = (token) => async (dispatch) => {
    try {
        dispatch({ type: SUGGES_TYPES.LOADING, payload: true })
        
        const res = await getDataAPI('suggestionsUser', token)
        dispatch({ type: SUGGES_TYPES.GET_USERS, payload: res.data })

        dispatch({ type: SUGGES_TYPES.LOADING, payload: false })
        
    } catch (err) {
        console.log(err.message)
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}