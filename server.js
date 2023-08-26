import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authrouter from './routes/authRouter.js';
import userrouter from './routes/userRouter.js';
import cloudinary from 'cloudinary';
import postRouter from './routes/postRouter.js';
import commentRouter from './routes/commentRouter.js';
import http from 'http'
import  {Server}  from 'socket.io';
import { SocketServer } from './socketServer.js';
import notifyRouter from './routes/notifyRouter.js'
const app = express();
app.use(cors({origin: true, credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],

}));
dotenv.config();
const server=http.createServer(app)
const io=new Server(server,{
  cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    }
  }
  )
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({limit: '50mb'}));
app.set("trust proxy", 1);
app.use(cookieParser())
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
   })
 mongoose.connect(process.env.MONGO_URL,{
 
    dbName:'socialplatform'
}).then((c)=>{
    console.log(`Database Connected with ${c.connection.host}`)
})


app.get('/',(req, res) => {

    res.send('Hello World!')
})
app.use('/api',authrouter)
app.use('/api',userrouter)
app.use('/api',postRouter)
app.use('/api',commentRouter)
app.use('/api',notifyRouter)

 io.on('connection',(socket)=>{
  console.log('socket connected')
  SocketServer(socket,io)
 })


server.listen(process.env.PORT,()=>{
    console.log('listening on port')
   
})
server.on('uncaughtException',()=>{
   
        process.exit(1);
    
})
