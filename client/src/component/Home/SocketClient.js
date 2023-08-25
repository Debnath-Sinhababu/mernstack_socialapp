import React from 'react'
import { useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { NOTIFY_TYPES } from '../../redux/actions/notifyAction'
import { POST_TYPES } from '../../redux/actions/postAction'
import { GLOBALTYPES } from '../../redux/GlobalTypes'
const SocketClient = () => {
    const {socket,auth,HomePost,notify}=useSelector((state)=>state)
    const dispatch=useDispatch()
    useEffect(()=>{
     socket.emit('joinuser',auth.user)
    },[dispatch,socket,auth.user])

    useEffect(()=>{
      socket.on('likeToClient',({newPost})=>{
        console.log(newPost)
       
        dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
      })
      return () => socket.off('likeToClient')
    },[HomePost,auth,socket,dispatch])
    useEffect(()=>{
      socket.on('unlikeToClient',({post,user})=>{
        console.log(post)
        const newPost = {...post, likes: post.likes.filter((u)=>u._id!==user._id)}
        console.log(newPost)
        dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
      })
      return () => socket.off('unlikeToClient')
    },[HomePost,auth,socket,dispatch])

    useEffect(() => {
      socket.on('createCommentToClient', newPost =>{
          dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
      })

      return () => socket.off('createCommentToClient')
  },[socket, dispatch])
  useEffect(() => {
    socket.on('deleteCommentToClient', newPost =>{
        dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
    })

    return () => socket.off('deleteCommentToClient')
},[socket, dispatch])


// Follow
useEffect(() => {
    socket.on('followToClient', newUser =>{
        dispatch({type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})
    })

    return () => socket.off('followToClient')
},[socket, dispatch, auth])

useEffect(() => {
    socket.on('unFollowToClient', newUser =>{
        dispatch({type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})
    })

    return () => socket.off('unFollowToClient')
},[socket, dispatch, auth])

useEffect(() => {
  socket.on('createNotifyToClient', msg =>{
      dispatch({type: NOTIFY_TYPES.CREATE_NOTIFY, payload: msg})

      
  })

  return () => socket.off('createNotifyToClient')
},[socket, dispatch, notify.sound])

useEffect(() => {
  socket.on('removeNotifyToClient', msg =>{
      dispatch({type: NOTIFY_TYPES.REMOVE_NOTIFY, payload: msg})
  })

  return () => socket.off('removeNotifyToClient')
},[socket, dispatch])

  return (
    <div>
      
    </div>
  )
}

export default SocketClient
