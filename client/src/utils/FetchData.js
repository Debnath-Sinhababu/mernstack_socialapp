import axios from 'axios'
   const API=axios.create({baseURL:process.env.REACT_APP_BASE_URL,withCredentials:true})
   
export const getDataAPI=async(url,token)=>{
   const res=await API.get(`/api/${url}`,{
    headers:{
        Authorization:token
    }
   })
   return res
}
export const postDataAPI = async (url, post={}, token) => {
    console.log(url)
    const res = await API.post(`/api/${url}`, post, {
        headers: { Authorization: token}
    })
    console.log(res)
    return res;
}

export const putDataAPI = async (url, post={}, token) => {
    const res = await API.put(`/api/${url}`, post, {
        headers: { Authorization: token}
    })
    return res;
}

export const patchDataAPI = async (url, post={}, token) => {
    const res = await API.patch(`/api/${url}`, post, {
        headers: { Authorization: token}
    })
    return res;
}

export const deleteDataAPI = async (url,token) => {
  
    const res = await API.delete(`/api/${url}`, {
        headers: { Authorization: token}
    })
    return res;
}