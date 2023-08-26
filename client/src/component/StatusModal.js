import React, { useState } from 'react'
import { GLOBALTYPES } from '../redux/GlobalTypes'
import { useDispatch, useSelector } from 'react-redux'
import { useRef } from 'react'
import { createPost, updatePost } from '../redux/actions/postAction'
import { useEffect } from 'react'
const StatusModal = () => {
  const [content, setContent] = useState('')
  const dispatch = useDispatch()
  const { auth, status,socket} = useSelector(state => state)
  const [images, setImages] = useState([])
  const [videos,setVideos]=useState([])
  const [stream, setStream] = useState(false)
  const [tracks, setTracks] = useState('')
  const videoRef = useRef()
  const refCanvas = useRef()

  useEffect(()=>{
   if(status.onEdit){
     for(let i=0;i<status.images.length;i++){
         if(status.images[i].type=='video'){
            setVideos((old)=>[...old,status.images[i]])
         }
         else{
            setImages((old)=>[...old,status.images[i]])
         }
     }
   
    setContent(status.content)
   }
  },[status])

  const handleChangeImages = (e) => {
    const files = [...e.target.files]
    let err = ""
    let newImages = []

     console.log(files)
    files.forEach((file) => {
        if(!file) return err = "File does not exist."
        if(file.type!='image/jpeg' && file.type!='image/png' && file.type!='video/mp4' && file.type!='video/mp3'){
            return err='Files type not supported'
        }
        if(file.size > 1024 * 1024 * 5){
            return err = "The image/video largest is 5mb."
        }
        const filereader=new FileReader()
        filereader.onload=async()=>{
             if(filereader.readyState==2){
              if(filereader.result.includes('image'))
              setImages((old)=>[...old,filereader.result])

             else if(filereader.result.includes('video')){
               setVideos((old)=>[...old,filereader.result])
             }
          
             }
        }
        filereader.readAsDataURL(file)
      
    })
    
    if(err) dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err} })
    
}
console.log(images)
  const handleStream=async()=>{
    setStream(true)
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
        try {
            const streamData = await navigator.mediaDevices.getUserMedia({
               
                video: true,
            });
            console.log(streamData)
           videoRef.current.srcObject=streamData
           videoRef.current.play()
           const track = streamData.getTracks()
           console.log(track[0])
           setTracks(track[0])
        } catch (err) {
           console.log(err.message)
        }
    }
  }
  const handleStopStream = () => {
    tracks.stop()
    console.log(tracks)
    setStream(false)
}
const deleteImages = (index) => {
    const newArr = [...images]
    newArr.splice(index, 1)
    setImages(newArr)
}
const deleteVideos=(index)=>{
    const newArr = [...videos]
    newArr.splice(index, 1)
   setVideos(newArr)
}

const handleCapture = () => {
    const width = videoRef.current.clientWidth;
    const height = videoRef.current.clientHeight;

    refCanvas.current.setAttribute("width", width)
    refCanvas.current.setAttribute("height", height)

    const ctx = refCanvas.current.getContext('2d')
    ctx.drawImage(videoRef.current, 0, 0, width, height)
    let URL = refCanvas.current.toDataURL()
    console.log(URL)
    setImages([...images, {camera: URL}])
}

 const handleSubmit=(e)=>{
    e.preventDefault()
    if(images.length==0 && videos.length==0){
        dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "Please upload atleast one image or video"} })
        return
    }
   
    if(stream){
        dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "Please stop the stream before posting"} })
        return
    }
     if(status.onEdit){
        dispatch(updatePost({content, images, auth, status}))
     }
     else{

        dispatch(createPost({images, content,videos},auth,socket))
     }
   
    dispatch({ type: GLOBALTYPES.STATUS, payload: false })
    
   
    setImages([])
 }
  return (
    <div className="status_modal">
    <form onSubmit={handleSubmit}>
        <div className="status_header">
            <h5 className="m-0">Create Post</h5>
            <span onClick={() => {dispatch({
                type: GLOBALTYPES.STATUS, payload: false
            })
           tracks && tracks.stop()
           stream && setStream(false)
            }}>
                &times;
            </span>
        </div>

        <div className="status_body">
            <textarea name="content" value={content}
            placeholder={`${auth.user.username}, what are you thinking?`}
            onChange={e => setContent(e.target.value)}
           
            />

           
       <div className="show_images">
                        {
                            images.map((img, index) => (
                                <div key={index} id="file_img">
                                    {
                                        img.camera? <img src={img.camera}  className="img-thumbnail"  style={{filter:  'invert(0)'}}/>:
                                        img.url? <img src={img.url}  className="img-thumbnail"  style={{filter:  'invert(0)'}}/>:
                                        <img src={img} alt="images" className="img-thumbnail"
        style={{filter:  'invert(0)'}} />
                                    }
                                    
    
                                    <span onClick={() => deleteImages(index)}>&times;</span>
                                </div>
                            ))
                        }
                        {
                           videos.map((video, index) => (
                            <div key={index} id="file_img">
                                {
                                 
                                 video.url? <video src={video.url}  className="img-thumbnail"  style={{filter:  'invert(0)'}}/>:
                                    <video src={video} alt="images" className="img-thumbnail"
    style={{filter:  'invert(0)'}} />
                                }
                                

                                <span onClick={() => deleteVideos(index)}>&times;</span>
                            </div>
                        ))  
                        }
                    </div>
           
                    {
                        stream && 
                        <div className="stream position-relative">
                            <video autoPlay muted ref={videoRef} width="100%" height="100%"
                            style={{filter:'invert(0)'}} />
                            
                            <span onClick={handleStopStream}>&times;</span>
                            <canvas ref={refCanvas} style={{display: 'none'}} />
                        </div>
                    }
            

            <div className="input_images">
                
                    {
       
                 stream?  <i className="fas fa-camera" onClick={handleCapture} />:

                 <>
<i className="fas fa-camera" onClick={handleStream} />

<div className="file_upload">
    <i className="fas fa-image"
    
    />
    <input type="file" name="file" id="file"
    multiple accept="image/*,video/*,.pdf" 
    onChange={handleChangeImages}
    />
</div>
</>   
                    }
                                         
                   
                
                
            </div>

        </div>

        <div className="status_footer">
            <button className="btn btn-secondary w-100" type="submit">
                Post
            </button>
        </div>

    </form>
</div>
  )
}

export default StatusModal
