import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { follow, unfollow } from '../../redux/actions/profileAction'

const FollowButton = ({user}) => {
    const [followed, setFollowed] = useState(false)
    const { auth, profile ,socket} = useSelector(state => state)
    const [load, setLoad] = useState(false)
   
    const dispatch = useDispatch()

    useEffect(()=>{
        if(auth.user && auth.user.following.find((item)=>item._id==user._id)){
            setFollowed(true)
        }
    },[auth.user,user])
    const handleFollow =  async () => {
        if(load) return;

        setFollowed(true)
        setLoad(true)
        console.log(user)
        await dispatch(follow({users: profile.users, user, auth,socket}))
        setLoad(false)
        
    }

    const handleUnFollow = async () => {
        if(load) return;

        setFollowed(false)
        setLoad(true)
        console.log(user)
        await dispatch(unfollow({users: profile.users, user,auth,socket}))
        setLoad(false)
    }
  return (
    <>
    {
        followed
        ? <button className="btn btn-outline-danger"
        onClick={handleUnFollow}>
            UnFollow
        </button>
        : <button className="btn btn-outline-info"
        onClick={handleFollow}>
            Follow
        </button>
    }
    </>
  )
}

export default FollowButton
