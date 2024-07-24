import React, { useState,useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../../redux/GlobalTypes'
import { getDataAPI } from '../../utils/FetchData'
import UserCard from '../UserCard'
import loader from '../../image/loading.gif'



const Search = () => {
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])

    const { auth } = useSelector(state => state)
    const dispatch = useDispatch()
    const [load, setLoad] = useState(false)

    console.log(users)
    const handleSearch = async (e='') => {
       e && e.preventDefault()
        if(!search) return;

        try {
            setLoad(true)
            const res = await getDataAPI(`search?username=${search}`, auth.token)
            console.log(res.data.users)
            setUsers(res.data.users)
            setLoad(false)
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}
            })
        }
    }

    const handleClose = () => {
        setSearch('')
        setUsers([])
    }

    useEffect(()=>{
        handleSearch()
    },[search])

    return (
        <form className="search_form" onSubmit={
             (e)=>{
                handleSearch(e)
             }
           
            }>
            <input type="text" name="search" value={search} id="search" title="Enter to Search"
            onChange={e => {
                  if(e.target.value=='')
                   setUsers([])
                setSearch(e.target.value.toLowerCase().replace(/ /g, ''))
    }
            } />

            <div className="search_icon" style={{opacity: search ? 0 : 0.3}}>
                <span className="material-icons">search</span>
                <span>Enter to Search</span>
            </div>

            <div className="close_search" onClick={handleClose}
            style={{opacity: users.length === 0 ? 0 : 1}} >
                &times;
            </div>

            <button type="submit" style={{display: 'none'}}>Search</button>

            {
                load ? <img src={loader} alt="loading" className="loading" />:
                <div className="users">
                {
                 search && users?.map((user)=>(
                   <>
                   <UserCard user={user} border='border' handleClose={handleClose} />
                   </>
                  ))
              }
  
                </div>
            }
             
            

           
        </form>
    )
}

export default Search