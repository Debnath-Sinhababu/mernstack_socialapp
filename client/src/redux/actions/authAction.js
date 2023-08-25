import { postDataAPI } from "../../utils/FetchData"
import { GLOBALTYPES } from "../GlobalTypes"
import valid from "../../utils/valid"
export const login = (data) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        const res = await postDataAPI('login', data)
       
        dispatch({ 
            type: GLOBALTYPES.AUTH, 
            payload: {
                token: res.data.access_token,
                user: res.data.user
            } 
        })

        localStorage.setItem("firstLogin", true)
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                success: res.data.msg
            } 
        })
        
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}
export const refreshToken=()=>{
    return async (dispatch) => {
         if(localStorage.getItem("firstLogin")) {
           

        try {
            dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
            const res = await postDataAPI('refresh_token')
            console.log(res)
            dispatch({ 
                type: GLOBALTYPES.AUTH, 
                payload: {
                    token: res.data.access_token,
                    user: res.data.user
                } 
            })
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {}
                    
                 
            })
            
        } catch (err) {
            console.log(err.message)
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {
                    error: err?.response?.data.msg
                } 
            })
        }
    }
    }
}

export const register = (data) => async (dispatch) => {
    try {
           const check=valid(data)
           if(check.errLength>0){
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {
                    ... check.errMsg
                } 
            })
            return
           }

        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        const res = await postDataAPI('register', data)
         console.log(res)
        dispatch({ 
            type: GLOBALTYPES.AUTH, 
            payload: {
                msg: res.data.message,
                user: res.data.user,
                token: res.data.access_token
            } 
        })

        localStorage.setItem("firstLogin", true)
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                success: res.data.message
            } 
        })
        
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}

export const logout=()=>async (dispatch)=>{
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        const res = await postDataAPI('logout')
        console.log(res)
        localStorage.removeItem("firstLogin")
        dispatch({ 
            type: GLOBALTYPES.AUTH, 
            payload: {
                msg: res.data.msg,
                success:true
            } 
        })
       
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                success: res.data.msg
            } 
        })
        
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}