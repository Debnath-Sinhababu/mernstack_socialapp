import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../../../redux/GlobalTypes'
import { deletePost } from '../../../redux/actions/postAction'
import { useNavigate } from 'react-router-dom'
import { BASEURL } from '../../../utils/config'
const CardHeader = ({post}) => {
    const {auth,socket} = useSelector(state => state)
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const handleEditPost = () => {
        dispatch({ type: GLOBALTYPES.STATUS, payload: {...post, onEdit: true}})
    }
    const handleDeletePost = () => {
        let result =window.confirm('Are you sure you want to delete this post?')
            if(result){
            dispatch(deletePost({post, auth,socket}))
            return navigate('/')
            }
        
    }
   const handleCopyLink=()=>{
    navigator.clipboard.writeText(`${BASEURL}/post/${post._id}`)
   }
  return (
    <div className="card_header">
    <div className="d-flex">
        <img src={post.user.avatar} className="big-avatar" />

        <div className="card_name">
            <h6 className="m-0">
                <Link to={`/profile/${post.user._id}`} className="text-dark">
                    {post.user.username}
                </Link>
            </h6>
            <small className="text-muted">
                {moment(post.createdAt).fromNow()}
            </small>
        </div>
    </div>

    <div className="nav-item dropdown">
        <span className="material-icons" id="moreLink" data-toggle="dropdown">
            more_horiz
        </span>

        <div className="dropdown-menu">
            {
                auth.user._id ===post.user._id &&
                <>
                    <div className="dropdown-item"
                     onClick={handleEditPost}
                    >
                        <span className="material-icons"
                       
                        >edit</span> Edit Post
                    </div>
                    <div className="dropdown-item" onClick={handleDeletePost}>
                        <span className="material-icons">delete_outline</span> Remove Post
                    </div>
                </>
            }

            <div className="dropdown-item" onClick={handleCopyLink}>
                <span className="material-icons">content_copy</span> Copy Link
            </div>
        </div>
    </div>
</div>
  )
}

export default CardHeader
