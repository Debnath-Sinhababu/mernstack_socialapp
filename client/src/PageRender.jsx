import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import NotFound from './component/NotFound'
import Login from './pages/login'
const generatePage = (pageName) => {
  console.log(pageName)
  const component = () => require(`./pages/${pageName}`).default
    console.log(component)
  try {
      return React.createElement(component())
  } catch (err) {
    console.log(err)
      return <NotFound />
  }
}

const PageRender = () => {
  const {page, id} = useParams()
  const { auth } = useSelector(state => state)
    let pageName = "";
    if(auth.token){
      if(id){
        pageName = `${page}/[id]`
    }else{
        pageName = `${page}`
    }
    }
    
 
    return generatePage(pageName)
  
}

export default PageRender
