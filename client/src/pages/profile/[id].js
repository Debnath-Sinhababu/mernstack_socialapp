import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Info from '../../component/profile/Info'
import Posts from '../../component/profile/Posts'
import { useSelector,useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getProfileUsers } from '../../redux/actions/profileAction'
import loader from '../../image/loading.gif'
import Saved from '../../component/profile/Saved'
const Profile = () => {
    const dispatch=useDispatch()
    const {id}=useParams()
    const {auth,profile}=useSelector((state)=>state)
    const [saveTab, setSaveTab] = useState(false)
    useEffect(()=>{
        console.log(profile?.users?.every((user)=>user._id!=id))
     
       if(profile?.users?.every((user)=>user._id!=id))
        dispatch(getProfileUsers({id,auth}))
      
    },[id,dispatch])
    console.log(profile.users)
  return (
    <div className='profile'>
        
     <Info auth={auth} profile={profile} />
     {
                auth.user._id === id &&
                <div className="profile_tab">
                    <button className={saveTab ? '' : 'active'} onClick={() => setSaveTab(false)}>Posts</button>
                    <button className={saveTab ? 'active' : ''} onClick={() => setSaveTab(true)}>Saved</button>
                </div>
            }
     {
                profile.loading 
                ? <img className="d-block mx-auto medium-avatar" src={loader} alt="loading" />
                : <>
                    {
                        saveTab
                        ? <Saved auth={auth} dispatch={dispatch} />
                        : <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
                    }
                </>
            }
    </div>
  )
}

export default Profile
