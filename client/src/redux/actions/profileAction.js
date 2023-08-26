import { getDataAPI, patchDataAPI, putDataAPI } from "../../utils/FetchData"
import { GLOBALTYPES } from "../GlobalTypes"
import { createNotify, removeNotify } from "./notifyAction"

export const PROFILE_TYPES = {
    LOADING: 'LOADING_PROFILE',
    GET_USER: 'GET_PROFILE_USER',
    FOLLOW: 'FOLLOW',
    UNFOLLOW: 'UNFOLLOW',
    GET_ID: 'GET_PROFILE_ID',
    GET_POSTS: 'GET_PROFILE_POSTS',
    UPDATE_POST: 'UPDATE_PROFILE_POST'
}

export const getProfileUsers = ({id, auth}) => async (dispatch) => {
   

    try {
        dispatch({type: PROFILE_TYPES.LOADING, payload: true})
        const res =  getDataAPI(`user/${id}`, auth.token)
        const res1 = getDataAPI(`/user_posts/${id}`, auth.token)
      
       const users = await res;
        
       const posts = await res1;

        dispatch({
            type: PROFILE_TYPES.GET_USER,
            payload: users.data
        })
        
        dispatch({
            type: PROFILE_TYPES.GET_POSTS,
            payload: {...posts.data, _id: id, page: 2}
        })
       

        dispatch({type: PROFILE_TYPES.LOADING, payload: false})
    } catch (err) {
        console.log(err.message)
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }
    
}

export const updateProfileUser = ({userData, avatar, auth}) => async (dispatch) => {
   
    try {
        let media;
        dispatch({type: GLOBALTYPES.ALERT, payload: {loading: true}})

        

        const res = await putDataAPI("user", {
            ...userData,
            avatar
        }, auth.token)

        dispatch({
            type: GLOBALTYPES.AUTH,
            payload: {
               
                user: res.data.user
            }
        })

        dispatch({type: GLOBALTYPES.ALERT, payload: {success: res.data.msg}})
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }
}

export const follow = ({users,user,auth,socket}) => async (dispatch) => {
      try {
        console.log(user)
        let newUser;
        if(users.every((item)=>item._id!==user._id)){
            newUser={
                ...user,
                followers:[...user.followers,auth.user]
             }
        } else{
          for(let i=0;i<users.length;i++){
            if(users[i]._id===user._id){
                newUser={
                    ...users[i],
                    followers:[...users[i].followers,auth.user]
                 }
                break;
            }
          }

        }
    
     auth.user={
        ...auth.user,
         following:[...auth.user.following,newUser]
     }
   
     dispatch({ type: PROFILE_TYPES.FOLLOW, payload: newUser })
     dispatch({
        type: GLOBALTYPES.AUTH, 
        payload: auth
    })

    const res = await putDataAPI(`user/follow/${user._id}`,null, auth.token)
    socket.emit('follow', res.data.newUser)
    const msg = {
        id: auth.user._id,
        text: 'has started to follow you.',
        recipients: [newUser._id],
        url: `/profile/${auth.user._id}`,
    }

    dispatch(createNotify(msg, auth, socket))

   
      } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
      }
     

     
}

export const unfollow = ({users,user,auth,socket}) => async (dispatch) => {
    try {
      let newUser;
      console.log(user.followers)
      if(users.every(item=>item._id!=user._id)){
        newUser={
            ...user,
            followers:user.followers.filter((follower)=>follower._id!=auth.user._id)
         }
      }else{
        users.forEach(item => {
            if(item._id==user._id){
                newUser={
                    ...item,
                    followers:item.followers.filter((follower)=>follower._id.toString()!=auth.user._id.toString())
                 }
            }
        });
      }
  
   auth.user={
      ...auth.user,
       following:auth.user.following.filter((following)=>following._id.toString()!=user._id.toString())
   }
   dispatch({ type: PROFILE_TYPES.UNFOLLOW, payload: newUser })
   dispatch({
      type: GLOBALTYPES.AUTH, 
      payload: auth
  })
  const res = await putDataAPI(`user/unfollow/${user._id}`,null, auth.token)
     socket.emit('unFollow', res.data.newUser)
     const msg = {
        id: auth.user._id,
        text: 'has started to follow you.',
        recipients: [newUser._id],
        url: `/profile/${auth.user._id}`,
    }
    dispatch(removeNotify({msg, auth, socket}))
     
    } catch (err) {
        console.log(err.message)
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }
   

   
}


