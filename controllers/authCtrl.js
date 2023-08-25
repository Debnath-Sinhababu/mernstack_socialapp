import userModel from "../model/userModel.js";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";

const authCtrl={
   register: async (req,res)=>{
     try {
        const {fullname,username,email,password,gender} = req.body
        const newusername=username.toLowerCase().replace(/\s/g, '')
        const user_name = await userModel.findOne({username: newusername})
        if(user_name) return res.status(400).json({msg: "This user name already exists."})

        const user_email = await userModel.findOne({email})
        if(user_email) return res.status(400).json({msg: "This email already exists."})

        if(password.length < 6)
        return res.status(400).json({msg: "Password must be at least 6 characters."})
         const hashpassword=await bcrypt.hash(password,10)
       const newuser=  await userModel.create({
            ...req.body,
            username:newusername,
            password:hashpassword
         })
         const access_token = createAccessToken(newuser)
         const refresh_token = createRefreshToken(newuser)
         console.log(access_token)
          
        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            secure: true,
            maxAge: 30*24*60*60*1000 // 30days
        })
        res.json({
            success:true,
            message: "User Created Successfully",
            user:newuser,
            access_token
        })
     } catch (error) {
        return res.status(500).json({success:false,message: error.message})
     }
   },
   login: async (req,res)=>{
         try {
            const { email, password } = req.body
            const user = await userModel.findOne({email}).populate('followers following').select('+password')
            if(!user) return res.status(400).json({msg: "This email does not exist."})
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})
            const access_token = createAccessToken(user)
            const refresh_token = createRefreshToken(user)
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                secure: true,
                maxAge: 30*24*60*60*1000 // 30days
            })

            res.json({
                msg: 'Login Success!',
                access_token,
                user:{
                    ...user._doc,
                    password:''
                }
            })
         } catch (error) {
            return res.status(500).json({msg: err.message})
         }
   },
   logout: async (req,res)=>{
    try {
        res.clearCookie('refreshtoken')
        return res.json({msg: "Logged out!"})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
   },
   generateAccessToken: async (req,res)=>{
      try {
        
        const rf_token = req.cookies.refreshtoken
       
        if(!rf_token) return res.status(400).json({msg: "Please login now."})
         const {id}=Jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET)
        
       
          if(!id){
            return res.status(400).json({msg: "Please login now."})
          }
          const user = await userModel.findById(id).populate('followers following', '-password')
          if(!user) return res.status(400).json({msg: "This does not exist."})
          const access_token = createAccessToken(user)
         return res.json({
           success:true,
           user,
           access_token
         })

      } catch (error) {
        
      }
   }
}
const createAccessToken = (newuser) => {
   
    const token=Jwt.sign({id:newuser._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'})
   
    return token
}
const createRefreshToken = (newuser) => {
    const token=Jwt.sign({id:newuser._id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'30d'})
    return token
}
export default authCtrl
