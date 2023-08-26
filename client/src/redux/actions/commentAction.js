import { deleteDataAPI, postDataAPI, putDataAPI } from "../../utils/FetchData"
import { GLOBALTYPES } from "../GlobalTypes"
import { DeleteData, EditData } from "./GlobalTypes"
import { createNotify, removeNotify } from "./notifyAction"
import { POST_TYPES } from "./postAction"

export const createComment = ({post, newComment, auth,socket}) => async (dispatch) => {
    const newPost = {...post, comments: [...post.comments, newComment]}
    
   console.log(newComment)

    try {
        const data = {...newComment, postId: post._id, postUserId: post.user._id}
        const res = await postDataAPI('comment', data, auth.token)

        const newData = {...res.data.newComment}
        const newPost = {...post, comments: [...post.comments, newData]}
        dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })
        socket.emit('createComment', newPost)
        console.log(res.data)
        // Socket
        const msg = {
            id: res.data.newComment._id,
            text: newComment.reply ? 'mentioned you in a comment.' : 'has commented on your post.',
            recipients: newComment.reply ? [newComment.tag._id] : [post.user._id],
            url: `/post/${post._id}`,
            content: post.content, 
            image: post.images[0].url
        }

        dispatch(createNotify(msg, auth, socket))

        // Notify
       
        
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg} })
    }
}
export const updateComment = ({comment, post, content, auth}) => async (dispatch) => {
    const newComments = EditData(post.comments, comment._id, {...comment, content})
    const newPost = {...post, comments: newComments}
    
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })
    try {
      await putDataAPI(`comment/${comment._id}`, { content }, auth.token)
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg} })
    }
}

export const likeComment = ({comment, post, auth}) => async (dispatch) => {
    const newComment = {...comment, likes: [...comment.likes, auth.user]}

    const newComments = EditData(post.comments, comment._id, newComment)

    const newPost = {...post, comments: newComments}
    
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })

    try {
        await putDataAPI(`comment/${comment._id}/like`, null, auth.token)
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg} })
    }
}
export const unLikeComment = ({comment, post, auth}) => async (dispatch) => {

    const newComment = {...comment, likes: DeleteData(comment.likes, auth.user._id)}

    const newComments = EditData(post.comments, comment._id, newComment)

    const newPost = {...post, comments: newComments}
    
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })

    try {
        await putDataAPI(`comment/${comment._id}/unlike`, null, auth.token)
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg} })
    }
}

export const deleteComment = ({comment, post, auth,socket}) => async (dispatch) => {
   try {
     const deleteArr= [...post.comments.filter((com)=>com.reply===comment._id),comment]
     console.log(deleteArr)
       const newPostComments= post.comments.filter((comment)=>{
           for(let i=0;i<deleteArr.length;i++){
            if(comment._id===deleteArr[i]._id){
                return false
            }
           }
           return true
       })
       console.log(newPostComments)
       const newPost={...post,comments:newPostComments}
       dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })
       socket.emit('deleteComment', newPost)
       
      deleteArr.forEach(item => {
        const msg = {
            id: item._id,
            text: comment.reply ? 'mentioned you in a comment.' : 'has commented on your post.',
            recipients: comment.reply ? [comment.tag._id] : [post.user._id],
            url: `/post/${post._id}`,
        }

        dispatch(removeNotify({msg, auth, socket}))
      });

       const res = await deleteDataAPI(`comment/${comment._id}`, auth.token)
   } catch (err) {
    console.log(err)
    dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg} })
   }
    
}