import React from 'react'
import { useSelector } from 'react-redux'
import Post from '../component/Home/Post'
import RightSidebar from '../component/Home/RightSidebar'
import Status from '../component/Home/Status'
import LoadIcon from '../image/loading.gif'
const Home = () => {
  const {HomePost,auth}=useSelector((state)=>state)
  return (
    <div className="home row">
            <div className="col-md-8">
            <Status />

                {
                    HomePost.loading 
                    ? <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
                    : (HomePost.result === 0 && HomePost.posts.length === 0)
                        ? <h2 className="text-center">No Post</h2>
                        : <Post />
                }
                
            </div>
            
            <div className="col-md-4 ">
              <RightSidebar/>
            </div>
        </div>
  )
}

export default Home
