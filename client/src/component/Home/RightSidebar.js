import React from 'react'
import { useSelector, useDispatch } from 'react-redux'



import LoadIcon from '../../image/loading.gif'
import { getSuggestions } from '../../redux/actions/SuggestionAction'
import FollowButton from '../profile/FollowButton'
import UserCard from '../profile/UserCard'



const RightSideBar = () => {
    const { auth, suggestions } = useSelector(state => state)
    const dispatch = useDispatch()

    return (
        <div className="mt-3">
            <UserCard user={auth.user} />

            <div className="d-flex justify-content-between align-items-center my-2">
                <h5 className="text-danger">Suggestions for you</h5>
                {
                    !suggestions.loading &&
                    <i className="fas fa-redo" style={{cursor: 'pointer'}}
                    onClick={ () => dispatch(getSuggestions(auth.token)) } />
                }
            </div>

            {
                suggestions.loading
                ? <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4 medium-avatar" />
                : <div className="suggestions">
                    {
                        suggestions.users.map(user => (
                            <UserCard key={user._id} user={user} >
                                <FollowButton user={user} />
                            </UserCard>
                        ))
                    }
                </div>
            }

           
        </div>
    )
}

export default RightSideBar