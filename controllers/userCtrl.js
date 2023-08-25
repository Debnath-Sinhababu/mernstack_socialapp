import userModel from "../model/userModel.js";

const userCtrl={
    searchUser: async(req,res,next)=>{
        try {
            const users = await userModel.find({username: {$regex: req.query.username,$options: "i"}})
            .limit(10).select("fullname username avatar")
            
            res.json({users})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await userModel.findById(req.params.id)
            .populate("followers following", "-password")
            if(!user) return res.status(400).json({msg: "User does not exist."})
            
            res.json({user})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUser: async (req, res) => {
        try {
           
            const { avatar, fullname, mobile, address, story, website, gender } = req.body
            if(!fullname) return res.status(400).json({msg: "Please add your full name."})
             
       avatar &&  await userModel.findOneAndUpdate({_id: req.user._id}, {
                avatar, fullname, mobile, address, story, website, gender
            })
          !avatar && await userModel.findOneAndUpdate({_id: req.user._id}, {
             fullname, mobile, address, story, website, gender
        })
          const user= await userModel.findById(req.user._id)
            res.json({msg: "Update Success!",
                user
        })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    follow: async (req, res) => {

        try {
            
            const user = await userModel.findById(req.params.id)
            if(user.followers.find((follower)=>follower._id==req.user._id)) return res.status(500).json({msg: "You followed this user."})

           user.followers.push(req.user._id)
           await user.save()

           const newUser= await userModel.findById(req.params.id).populate("followers following", "-password")
           const loggedinuser= await userModel.findById(req.user._id)
            loggedinuser.following.push(req.params.id)
            await loggedinuser.save()
            res.json({newUser})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unfollow: async (req, res) => {

        try {
           
            const user = await userModel.findById(req.params.id)
           const ispresent=user.followers.filter((follower)=>{
                 return  follower._id.toString()==req.user._id.toString()
           })
           if(ispresent.length==0){
            return res.status(500).json({msg: "You already unfollowed or have not followed this user."})
           }
         
            
            
              
           user.followers=user.followers.filter((follower)=>{
                 return follower._id.toString()!=req.user._id.toString()
           })
           await user.save()

           const newUser= await userModel.findById(req.params.id).populate("followers following", "-password")
           const loggedinuser= await userModel.findById(req.user._id)
            loggedinuser.following=loggedinuser.following.filter((following)=>following._id.toString()!=req.params.id.toString())
            await loggedinuser.save()
            res.json({newUser})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    suggestionsUser: async (req, res) => {
        try {
            const newArr = [...req.user.following, req.user._id]

            const num  = req.query.num || 10

            const users = await userModel.aggregate([
                { $match: { _id: { $nin: newArr } } },
                { $sample: { size: Number(num) } },
                { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
                { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' } },
            ])

            return res.json({
                users,
                result: users.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}
export default userCtrl