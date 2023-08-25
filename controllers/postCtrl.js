import postModel from "../model/postModel.js";
import cloudinary from "cloudinary";
import commentSchema from "../model/commentSchema.js";
import userModel from "../model/userModel.js";

class APIfeatures {
  constructor(query, queryString){
      this.query = query;
      this.queryString = queryString;
  }

  paginating(){
  
      const page = this.queryString.page * 1 || 1
      const limit = this.queryString.limit * 1 || 9
      const skip = (page - 1) * limit
      this.query = this.query.skip(skip).limit(limit)
      return this;
  }
}


const postCtrl = {
  createPost: async (req, res) => {
    try {
      const { content, images,videos } = req.body;
      
      if (images.length === 0 && videos.length==0)
        return res.status(400).json({ msg: "Please add atleast one image or video." });
      const uploadimage = [];
      for (let i = 0; i < images.length; i++) {
        if (images[i].camera) {
          const upload = await cloudinary.v2.uploader.upload(images[i].camera, {
            folder: "posts",
          });
          uploadimage.push({
            public_id: upload.public_id,
            url: upload.secure_url,
            type:'image'
          });
        } else {
          const upload = await cloudinary.v2.uploader.upload(images[i], {
            folder: "posts",
          });
          uploadimage.push({
            public_id: upload.public_id,
            url: upload.secure_url,
            type:'image'
          });
        }
      }
      for(let i=0;i<videos.length;i++){
        console.log(videos)
        const upload = await cloudinary.v2.uploader.upload(videos[i], {
          folder: "posts",
          resource_type:'video'
        });
        uploadimage.push({
          public_id: upload.public_id,
          url: upload.secure_url,
          type:'video'
        });
      }
      const newPost = await postModel.create({
        content,
        images: uploadimage,
        user: req.user,
      });

      console.log(newPost);
      res.json({
        msg: "Created Post!",
        newPost: {
          ...newPost._doc,
          user: req.user,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getPosts: async (req, res) => {
    try {
   
      const features=new APIfeatures( postModel
        .find({ user: [...req.user.following, req.user] }).sort('-createdAt')
        .populate("user likes", "avatar username fullname followers").populate({
           path:'comments',
           populate:{
            path:'user likes'
            
           }
        }),req.query)
        const posts= await features.paginating().query
      

    res.json({
      msg: "Success!",
      result: posts.length,
      posts,
    });
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
    
  },
  updatePost:async (req, res) => {
    try {
      const { content, images } = req.body;
    console.log(content,images)
      if (images.length === 0)
        return res.status(400).json({ msg: "Please add your photo." });
        const newimages=images.filter((image)=>!image.url)
        const oldimages=images.filter((image)=>image.url)
       
      const uploadimage = [...oldimages];
      for (let i = 0; i < newimages.length; i++) {
        if (newimages[i].camera) {
          const upload = await cloudinary.v2.uploader.upload(newimages[i].camera, {
            folder: "posts",
          });
          uploadimage.push({
            public_id: upload.public_id,
            url: upload.secure_url,
          });
        } else {
          const upload = await cloudinary.v2.uploader.upload(newimages[i], {
            folder: "posts",
          });
          uploadimage.push({
            public_id: upload.public_id,
            url: upload.secure_url,
          });
        }
      }
      console.log({uploadimage})
      console.log(req.params.id)
      const newPost = await postModel.findByIdAndUpdate(req.params.id,{
          content,
          images:uploadimage,
          user:req.user._id,
         
      }, { new:true}).populate("user likes", "avatar username fullname followers").populate({
        path:'comments',
        populate:{
         path:'user likes'
         
        }
     })
        

      console.log(newPost);
      res.json({
        msg: "updated Post!",
        newPost: {
          ...newPost._doc,
          user: req.user,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  likePost: async (req, res) => {
    try {
        const post = await postModel.find({_id: req.params.id, likes: req.user._id})
        if(post.length > 0) return res.status(400).json({msg: "You liked this post."})

        const like = await postModel.findOneAndUpdate({_id: req.params.id}, {
            $push: {likes: req.user._id}
        }, {new: true})

        if(!like) return res.status(400).json({msg: 'This post does not exist.'})

        res.json({msg: 'Liked Post!'})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
},
unLikePost: async (req, res) => {
  try {

      const like = await postModel.findOneAndUpdate({_id: req.params.id}, {
          $pull: {likes: req.user._id}
      }, {new: true})

      if(!like) return res.status(400).json({msg: 'This post does not exist.'})

      res.json({msg: 'UnLiked Post!'})

  } catch (err) {
      return res.status(500).json({msg: err.message})
  }
},
getUserPosts: async (req, res) => {
  try {
     
      const feature = new APIfeatures(postModel.find({user:req.params.id}).sort('-createdAt'),req.query)
      
     const posts=await feature.paginating().query

      res.json({
          posts,
          result: posts.length
      })

  } catch (err) {
      return res.status(500).json({msg: err.message})
  }
},

getPostsDicover: async (req, res) => {
  try {
   console.log('hello')
    const features=new APIfeatures( postModel
      .find({ user: {$nin:[...req.user.following, req.user] }}).sort('-createdAt')
      .populate("user likes", "avatar username fullname followers").populate({
         path:'comments',
         populate:{
          path:'user likes'
          
         }
      }),req.query)

     

      const posts= await features.paginating().query
      console.log(posts)
      return res.json({
          msg: 'Success!',
          result: posts.length,
          posts
      })

  } catch (err) {
      return res.status(500).json({msg: err.message})
  }
},

getPost: async (req, res) => {
  try {
      const post = await postModel.findById(req.params.id)
      .populate("user likes", "avatar username fullname followers")
      .populate({
          path: "comments",
          populate: {
              path: "user likes",
              select: "-password"
          }
      })

      if(!post) return res.status(400).json({msg: 'This post does not exist.'})

      res.json({
          post
      })

  } catch (err) {
      return res.status(500).json({msg: err.message})
  }
},
deletePost: async (req, res) => {
  try {
      const post = await postModel.findOneAndDelete({_id: req.params.id, user: req.user._id})
      await commentSchema.deleteMany({_id: {$in: post.comments }})

      res.json({
          msg: 'Deleted Post!',
          newPost: {
              ...post,
              user: req.user
          }
      })

  } catch (err) {
      return res.status(500).json({msg: err.message})
  }
},
savePost: async (req, res) => {
  try {
      const user = await userModel.find({_id: req.user._id, saved: req.params.id})
      if(user.length > 0) return res.status(400).json({msg: "You saved this post."})

      const save = await userModel.findOneAndUpdate({_id: req.user._id}, {
          $push: {saved: req.params.id}
      }, {new: true})

      if(!save) return res.status(400).json({msg: 'This user does not exist.'})

      res.json({msg: 'Saved Post!'})

  } catch (err) {
      return res.status(500).json({msg: err.message})
  }
},
unSavePost: async (req, res) => {
  try {
      const save = await userModel.findOneAndUpdate({_id: req.user._id}, {
          $pull: {saved: req.params.id}
      }, {new: true})

      if(!save) return res.status(400).json({msg: 'This user does not exist.'})

      res.json({msg: 'unSaved Post!'})

  } catch (err) {
      return res.status(500).json({msg: err.message})
  }
},
getSavePosts: async (req, res) => {
  try {
      const features = new APIfeatures(postModel.find({
          _id: {$in: req.user.saved}
      }), req.query).paginating()

      const savePosts = await features.query.sort("-createdAt")

      res.json({
          savePosts,
          result: savePosts.length
      })

  } catch (err) {
      return res.status(500).json({msg: err.message})
  }
},
};
export default postCtrl;
