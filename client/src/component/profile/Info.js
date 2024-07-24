import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import EditProfile from './EditProfile'
import FollowButton from './FollowButton'
import Followers from './Followers'
import Following from './Following'
const Info = ({auth,profile}) => {
    const {id}=useParams()
    const [userData, setUserData] = useState([])
    const [onEdit, setOnEdit] = useState(false)
    const [showFollowers, setShowFollowers] = useState(false)
    const [showFollowing, setShowFollowing] = useState(false)
    useEffect(() => {
        if(id === auth.user._id){
            setUserData([auth.user])
        }
        else{
            const user=profile.users.filter((user)=>user._id==id)
            console.log(user)
 setUserData(user)
        }
    }, [id, auth,profile])
  console.log(profile.users)
  return (
    <div className="info">
            {
                userData.map(user => (
                    <div className="info_container" key={user._id}>
                        <img src={user.avatar} className="supper-avatar" />

                        <div className="info_content">
                            <div className="info_content_title">
                                <h2>{user.username}</h2>
                                {
                                    user._id === auth.user._id
                                    ?  <button className="btn btn-outline-info"
                                     onClick={()=>{
                                        setOnEdit(!onEdit)
                                     }}
                                    >
                                        Edit Profile
                                    </button>
                                    
                                    : <FollowButton user={user}/>
                                }
                               
                                
                            </div>

                            <div className="follow_btn">
                                <span className="mr-4"
                                onClick={()=>setShowFollowers(!showFollowers)}
                                >
                                    {user.followers.length} Followers
                                </span>
                                <span className="ml-4"
                                onClick={()=>setShowFollowing(!showFollowing)}
                                >
                                    {user.following.length} Following
                                </span>
                            </div>

                            <h6>{user.fullname} <span className="text-danger">{user.mobile}</span></h6>
                            <p className="m-0">{user.address}</p>
                            <h6 className="m-0">{user.email}</h6>
                            <a href={user.website} target="_blank" rel="noreferrer">
                                {user.website}
                            </a>
                            <p>{user.story}</p>
                        </div>
                     {
                        onEdit && <EditProfile user={user} setOnEdit={setOnEdit} />
                     }
                       {
                            showFollowers &&
                            <Followers 
                            users={user.followers} 
                            setShowFollowers={setShowFollowers} 
                            />
                        }
                        {
                            showFollowing &&
                            <Following 
                            users={user.following} 
                            setShowFollowing={setShowFollowing} 
                            />
                        }
                    </div>
                ))
            }
        </div>

  )
}

export default Info
