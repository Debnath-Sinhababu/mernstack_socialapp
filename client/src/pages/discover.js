import React from 'react'
import { useState,useEffect } from 'react'
import { useSelector } from 'react-redux'
import { DISCOVER_TYPES, getDiscoverPosts } from '../redux/actions/discoverAction'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import LoadIcon from '../image/loading.gif'
import PostThumb from '../component/PostThumb'
import LoadMoreBtn from '../component/LoadMoreBtn'
import { getDataAPI } from '../utils/FetchData'
const Discover = () => {
  const {auth,discover}=useSelector((state)=>state)
  const [load, setLoad] = useState(false)
  const dispatch=useDispatch()
  const {id}=useParams()
 const location=useLocation()

  useEffect(()=>{
     if(!discover.firstLoad)
     dispatch(getDiscoverPosts(auth.token))
  },[location.pathname])

  const handleLoadMore = async () => {
    setLoad(true)
    const res = await getDataAPI(`post_discover?limit=${discover.page * 9}`, auth.token)
    dispatch({type: DISCOVER_TYPES.UPDATE_POST, payload: res.data})
    setLoad(false)
}
  return (
   
      <div>
          {
              discover.loading 
              ? <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4 medium-avatar" />
              : <PostThumb posts={discover.posts} result={discover.result} />
          }

        {
                load && <img src={LoadIcon} alt="loading" className="d-block mx-auto medium-avatar" />
            }

        {
                !discover.loading &&
                <LoadMoreBtn result={discover.result} page={discover.page}
                load={load} handleLoadMore={handleLoadMore} />
            }  
          
      </div>
  
  )
}

export default Discover
