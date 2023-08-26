import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { PROFILE_TYPES } from '../../redux/actions/profileAction'
import { getDataAPI } from '../../utils/FetchData'
import PostCard from '../PostCard'
import { useDispatch } from 'react-redux'
import { POST_TYPES } from '../../redux/actions/postAction'
import LoadIcon from '../../image/loading.gif'
import LoadMoreBtn from '../LoadMoreBtn'
const Post = () => {
  const { HomePost, auth} = useSelector(state => state)
  const [Load,setLoad]=useState(false)
  const dispatch=useDispatch()
  const handleLoadMore = async () => {
    setLoad(true)
    const res = await getDataAPI(`post/${auth.user._id}?limit=${HomePost.page * 9}`, auth.token)
    const newData = {...res.data, page: HomePost.page + 1}
    dispatch({type:POST_TYPES.GET_POSTS, payload: newData})
    setLoad(false)
}
  return (
    <div className="posts">
    {
        HomePost?.posts?.map(post => (
            <PostCard key={post._id} post={post}  />
        ))
    }

{
                Load && <img src={LoadIcon} alt="loading" className="d-block mx-auto medium-avatar" />
            }

     <LoadMoreBtn result={HomePost.result} page={HomePost.page}
            Load={Load} handleLoadMore={handleLoadMore} />
   
</div>
  )
}

export default Post
