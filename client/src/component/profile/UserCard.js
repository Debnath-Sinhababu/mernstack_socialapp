import React from 'react'
import { Link } from 'react-router-dom'

const UserCard = ({children, user, border, handleClose, setShowFollowers, setShowFollowing, msg}) => {
   
    const handleCloseAll = () => {
        if(handleClose) handleClose()
        if(setShowFollowers) setShowFollowers(false)
        if(setShowFollowing) setShowFollowing(false)
    }
  return (
    <div className={`d-flex p-2 align-items-center justify-content-between w-100 ${border}`}>
        {
            user && <div>
            <Link to={`/profile/${user._id}`} onClick={handleCloseAll}
            className="d-flex align-items-center">
                
                <img src={user.avatar} className="big-avatar" />
    
                <div className="ml-1" style={{transform: 'translateY(-2px)'}}>
                    <span className="d-block">{user.username}</span>
                    
                    <small style={{opacity: 0.7}}>
                        {
                           
                             user.fullname
                        }
                    </small>
                </div>
            </Link>
        </div>
        }
    
    
    {children}
</div>
  )
}

export default UserCard
