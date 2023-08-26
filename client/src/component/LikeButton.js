import React from 'react'
import { useSelector } from 'react-redux'

const LikeButton = ({isLike, handleLike, handleUnLike}) => {
  
     console.log(isLike)
    return (
        <>
            {
                isLike
                ? <i className="fas fa-heart text-danger" onClick={handleUnLike}
                style={{filter:  'invert(0)'}} />
                : <i className="far fa-heart" onClick={handleLike} />
            }
        </>
    )
}

export default LikeButton