import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Loading from './Loading'
const Alert = () => {
   const alert = useSelector(state => state.alert)
 
   useEffect(()=>{
  alert.success &&  toast.success(alert.success 
        );
        alert.error &&  toast.error(alert.error)
   },[alert])
  return (
    <div>
      {
        alert.loading && <Loading/>
      }
    
    </div>
  )
}

export default Alert
