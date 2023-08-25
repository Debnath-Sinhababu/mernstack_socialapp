import React from 'react'
import { useSelector } from 'react-redux'
import Comments from './Home/Comments'
import InputComment from './Home/InputComment'
import CardBody from './Home/post_card/CardBody'
import CardFooter from './Home/post_card/CardFooter'
import CardHeader from './Home/post_card/CardHeader'




const PostCard = ({post}) => {
    
    return (
        <div className="card my-3"> 
            <CardHeader post={post} />
            <CardBody post={post} />
            <CardFooter post={post} />
             <InputComment post={post}>

                
             </InputComment>
             <Comments post={post}/>
        </div>
    )
}
export default PostCard