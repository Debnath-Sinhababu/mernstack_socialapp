import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GLOBALTYPES } from '../../redux/GlobalTypes'

const Status = () => {
    const { auth } = useSelector(state => state)
    const dispatch = useDispatch()

    return (
        <div className="status my-3 d-flex">
            <img src={auth.user.avatar} className="big-avatar" />
            
            <button className="statusBtn flex-fill"
            onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: true })}>
                {auth.user.username}, what are you thinking?
            </button>
        </div>
    )
}

export default Status
