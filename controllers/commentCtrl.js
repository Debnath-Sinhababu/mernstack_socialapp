
import commentModel from "../model/commentSchema.js"
import postModel from "../model/postModel.js"
const commentCtrl={
    createComment: async (req, res) => {
        try {
            const { postId, content, reply,tag,  postUserId,likes } = req.body
            if(!content){
                return res.status(400).json({msg: "Please enter a comment."})
            }
            const post = await postModel.findById(postId)
            if(!post) return res.status(400).json({msg: "This post does not exist."})
            
          
            let newComment = await  commentModel.create({
                user: req.user._id, content, postUserId, postId,likes, reply,tag
            })
            newComment=await commentModel.findById(newComment._id).populate('user likes')
            await postModel.findOneAndUpdate({_id: postId}, {
                $push: {comments: newComment._id}
            }, {new: true})


            res.json({newComment})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateComment: async (req, res) => {
        try {
            const { content } = req.body
            
            await commentModel.findOneAndUpdate({
                _id: req.params.id, user: req.user._id
            }, {content})

            res.json({msg: 'Update Success!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    likeComment: async (req, res) => {
        try {
            const comment = await commentModel.find({_id: req.params.id, likes: req.user._id})
            if(comment.length > 0) return res.status(400).json({msg: "You liked this post."})

            await commentModel.findOneAndUpdate({_id: req.params.id}, {
                $push: {likes: req.user._id}
            }, {new: true})

            res.json({msg: 'Liked Comment!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unLikeComment: async (req, res) => {
        try {

            await commentModel.findOneAndUpdate({_id: req.params.id}, {
                $pull: {likes: req.user._id}
            }, {new: true})

            res.json({msg: 'UnLiked Comment!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteComment: async (req,res)=>{
        try {
            const commentId=req.params.id
        const comment=await commentModel.findById(commentId)
      
        const postId=comment.postId
        const post=await postModel.findById(postId)
      
         let indexarr=[]
        for (let i=0;i<post.comments.length;i++){
             const commentobj=await commentModel.findById(post.comments[i])
              
               if(commentobj?.reply?.toString()==comment._id.toString()){
                indexarr.push(i)
                console.log({'delete':commentobj})
                 await commentModel.findOneAndDelete({_id:commentobj?._id})

               }
                if(commentobj?._id?.toString()==comment._id.toString()){
                console.log(commentobj,'comment')
                indexarr.push(i)
                await commentModel.findOneAndDelete({_id:commentobj?._id})
               }
        }
        console.log(indexarr)
        for(let i=indexarr.length-1;i>=0;i--){
            post.comments.splice(indexarr[i],1)
            
        }
        
        await post.save()
        return res.json({
            msg:'comment deleted'
        })
        } catch (error) {
            return res.json({
                msg: error.message
            })
        }
        
    }
}
export default commentCtrl