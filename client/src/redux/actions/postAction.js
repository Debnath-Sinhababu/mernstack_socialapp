import { GLOBALTYPES } from "../GlobalTypes"
import { deleteDataAPI, getDataAPI, postDataAPI, putDataAPI } from "../../utils/FetchData"
import { createNotify, removeNotify } from "./notifyAction"
export const POST_TYPES = {
    CREATE_POST: 'CREATE_POST',
    LOADING_POST: 'LOADING_POST',
    GET_POSTS: 'GET_POSTS',
    UPDATE_POST: 'UPDATE_POST',
    GET_POST: 'GET_POST',
    DELETE_POST: 'DELETE_POST'
}

export const createPost = (data,auth,socket) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })     
        console.log(data)
        const res = await postDataAPI('posts', data, auth.token)
        console.log(res)
        dispatch({
            type: POST_TYPES.CREATE_POST,
            payload: res.data.newPost
        })
        dispatch({ type: GLOBALTYPES.ALERT, payload: {success:res.data.msg} })  

        const msg = {
            id: res.data.newPost._id,
            text: 'added a new post.',
            recipients: res.data.newPost.user.followers,
            url: `/post/${res.data.newPost._id}`,
            content:res.data.newPost.content,
            image: res.data.newPost.images[0].url
        }
        dispatch(createNotify(msg,auth,socket))

    } catch (err) {
        console.log(err)
        dispatch({ type: GLOBALTYPES.ALERT, payload: {msg: err.response.data.message} })  
    }
}
export const getPost=(id,token)=>async (dispatch)=>{
    try {
        dispatch({ type: POST_TYPES.LOADING_POST, payload: {loading: true} })     
        const res = await getDataAPI(`post/${id}`,token)
        console.log(res)
        dispatch({
            type: POST_TYPES.GET_POSTS,
            payload: res.data
        })
        dispatch({ type: POST_TYPES.LOADING_POST, payload: {loading:false} })  
    } catch (err) {
        console.log(err)
        dispatch({ type: GLOBALTYPES.ALERT, payload: {msg: err.response.data.message} })  
    }
}

export const updatePost = ({content, images, auth, status,videos}) => async (dispatch) => {
    try {
        const imgNewUrl = images.filter(img => !img.url)
        const imgOldUrl = images.filter(img => img.url)
        

        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })     
      
        const res = await putDataAPI(`post/${status._id}`,{content,images,videos,status},auth.token)
        console.log(res)
        dispatch({
            type: POST_TYPES.UPDATE_POST,
            payload: res.data.newPost
        })
        dispatch({ type: GLOBALTYPES.ALERT, payload: {success:res.data.msg} })  
    } catch (err) {
        console.log(err)
        dispatch({ type: GLOBALTYPES.ALERT, payload: {msg: err.response.data.message} })  
    }
}

export const likePost = ({post, auth,socket}) => async (dispatch) => {
    const newPost = {...post, likes: [...post.likes, auth.user]}
   
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost})
  
    

    try {
      
        console.log(newPost)
        await putDataAPI(`post/${post._id}/like`, null, auth.token)
        socket.emit('likePost',newPost)
        // Notify
       
        const msg = {
            id: auth.user._id,
            text: 'like your post.',
            recipients: [post.user._id],
            url: `/post/${post._id}`,
            content: post.content, 
            image: post.images[0].url
        }

        dispatch(createNotify(msg, auth, socket))

       

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const unLikePost = ({post, auth,socket}) => async (dispatch) => {
    const newPost = {...post, likes: post.likes.filter(like => like._id !== auth.user._id)}
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost})

    socket.emit('unlikePost',newPost)

    try {
        await putDataAPI(`post/${post._id}/unlike`, null, auth.token)
        const msg = {
            id: auth.user._id,
            text: 'like your post.',
            recipients: [post.user._id],
            url: `/post/${post._id}`,
            content: post.content, 
            image: post.images[0].url
        }
        dispatch(removeNotify({msg, auth, socket}))
        // Notify
        
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const getsinglePost = ({detailPost, id, auth}) => async (dispatch) => {
    if(detailPost.every(post => post._id !== id)){
        try {
            const res = await getDataAPI(`singlepost/${id}`, auth.token)
            dispatch({ type: POST_TYPES.GET_POST, payload: res.data.post })
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {error: err.response.data.msg}
            })
        }
    }
}

export const deletePost = ({post, auth,socket}) => async (dispatch) => {
    dispatch({ type: POST_TYPES.DELETE_POST, payload: post })

    try {
        const res = await deleteDataAPI(`post/${post._id}`, auth.token)

        // Notify
        const msg = {
            id: post._id,
            text: 'added a new post.',
            recipients: res.data.newPost.user.followers,
            url: `/post/${post._id}`,
        }
        dispatch(removeNotify({msg, auth, socket}))
        
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const savePost = ({post, auth}) => async (dispatch) => {
    const newUser = {...auth.user, saved: [...auth.user.saved, post._id]}
    dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})

    try {
        await putDataAPI(`savePost/${post._id}`, null, auth.token)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const unSavePost = ({post, auth}) => async (dispatch) => {
    const newUser = {...auth.user, saved: auth.user.saved.filter(id => id !== post._id) }
    dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})

    try {
        await putDataAPI(`unSavePost/${post._id}`, null, auth.token)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}
