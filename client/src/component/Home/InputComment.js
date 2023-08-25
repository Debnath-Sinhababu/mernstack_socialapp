import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createComment } from '../../redux/actions/commentAction'
import { getPost } from '../../redux/actions/postAction'


const InputComment = ({children, post, onReply, setOnReply}) => {
    const [content, setContent] = useState('')

    const { auth,socket } = useSelector(state => state)
    const dispatch = useDispatch()

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(!content.trim()){
            if(onReply)
            setOnReply(false)
            return;
        }
        const newComment = {
            content,
            likes: [],
            user: auth.user,
            createdAt: new Date().toISOString(),
            reply:onReply && onReply.commentId,
            tag: onReply && onReply.user
          
        }
        setContent('')
        
       onReply && setOnReply(false)
        
        await dispatch(createComment({post, newComment, auth,socket}))

         dispatch(getPost(auth.user._id,auth.token))
    }

    return (
        <form className="card-footer comment_input" onSubmit={handleSubmit} >
            {children}
            <input type="text" placeholder="Add your comments..."
            value={content} onChange={e => setContent(e.target.value)}
            style={{
                filter:'invert(0)',
                color: '#111',
                background:  '',
            }} />

          

            <button type="submit" className="postBtn">
                Post
            </button>
        </form>
    )
}

export default InputComment


// 6f9,705