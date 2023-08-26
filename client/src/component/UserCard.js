import React from 'react'
import { Link } from 'react-router-dom'

const UserCard = ({user,border,handleClose}) => {
  return (
    <div className={`d-flex p-2 align-items-center justify-content-between w-100 ${border}`}>
    <div>
        <Link to={`/profile/${user._id}`} 
        className="d-flex align-items-center"
        onClick={handleClose}
        >
            
            <img src={user.avatar} className='avatar' />

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
    
  
</div>
  )
}

export default UserCard
