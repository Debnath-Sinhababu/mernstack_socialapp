import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PostThumb = ({posts, result}) => {
   

    if(result === 0) return <h2 className="text-center text-danger">No Post</h2>

    return (
        <div className="post_thumb">
            {
              posts.length>0 &&  posts.map(post => (
                    <Link key={post._id} to={`/post/${post._id}`}>
                        <div className="post_thumb_display">

                            {
                            post.images.length > 0 &&
                                 post.images[0].type=='image'?
                                <img src={post.images[0].url} alt={post.images[0].url}
                                style={{filter:  'invert(0)'}} />:
                                <video src={post.images[0].url} alt={post.images[0].url}
                                
                                style={{filter:  'invert(0)'}} />
                            }

                            <div className="post_thumb_menu">
                                <i className="far fa-heart">{post.likes.length}</i>
                                <i className="far fa-comment">{post.comments.length}</i>
                            </div>
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}

export default PostThumb