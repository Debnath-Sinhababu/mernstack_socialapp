import React from 'react'
import { useSelector } from 'react-redux'
import FollowButton from './FollowButton'
import UserCard from './UserCard'

const Following = ({users,setShowFollowing}) => {
    const { auth } = useSelector(state => state)
   console.log(users)
  return (
    <div className="follow">
            <div className="follow_box">
                <h5 className="text-center">Following</h5>
                <hr/>
                
                <div className="follow_content">
                    {
                        users.map(user => (
                            <UserCard key={user._id} user={user} setShowFollowing={setShowFollowing} >
                                {
                                    auth.user._id !== user._id && <FollowButton user={user} />
                                }
                            </UserCard>
                        ))
                    }
                </div>
                

                <div className="close" onClick={() => setShowFollowing(false)}>
                    &times;
                </div>
                
            </div>
        </div>
  )
}

export default Following
