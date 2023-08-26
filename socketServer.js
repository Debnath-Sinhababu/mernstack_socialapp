 
 let users=[]
 
 export const SocketServer=(socket,io)=>{
   
   socket.on('joinuser',(user)=>{
      if(users?.find((u)=>u._id?.toString()==user._id?.toString())){
       
      }
      else{
     
        users.push({id:user._id,socketId:socket.id,followers:user.followers})
      }
   })
  
   socket.on('likePost',newPost=>{
    console.log(newPost)
     const ids=[...newPost.user.followers,newPost.user._id]
     const client=users.filter((user)=>ids.includes(user.id))

     console.log({client})
      if(client.length>0){
         client.forEach(element => {
           io.to(element.socketId).emit('likeToClient',{newPost})
         });
      }
   })
   socket.on('unlikePost',(newPost)=>{
     console.log('unlike')
    const ids=[...newPost.user.followers,newPost.user._id]
    console.log({ids})
    const client=users.filter((user)=>ids.includes(user.id))
    console.log({client})
     if(client.length>0){
        client.forEach(element => {
          io.to(element.socketId).emit('unlikeToClient',newPost)
        });
     }
  })

  socket.on('createComment', newPost => {
     
    const ids = [...newPost.user.followers, newPost.user._id]
    console.log({ids})
    console.log({users})
    const clients = users.filter(user => ids.includes(user.id))
    console.log({clients})
    if(clients.length > 0){
        clients.forEach(client => {
            socket.to(`${client.socketId}`).emit('createCommentToClient', newPost)
        })
    }
})

socket.on('deleteComment', newPost => {
  const ids = [...newPost.user.followers, newPost.user._id]
  const clients = users.filter(user => ids.includes(user.id))

  if(clients.length > 0){
      clients.forEach(client => {
          socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost)
      })
  }
})
socket.on('follow', newUser => {
  const user = users.find(user => user.id === newUser._id)
  user && socket.to(`${user.socketId}`).emit('followToClient', newUser)
})

socket.on('unFollow', newUser => {
  const user = users.find(user => user.id === newUser._id)
  user && socket.to(`${user.socketId}`).emit('unFollowToClient', newUser)
})

socket.on('createNotify', msg => {
  const client = users.filter(user => msg.recipients.includes(user.id))
   client.length>0 && 
    client.forEach(element => {
     socket.to(`${element.socketId}`).emit('createNotifyToClient', msg)
    });
  
})

socket.on('removeNotify', msg => {
  console.log({msg})
  const client = users.filter(user => msg.recipients.includes(user.id))
  client.length>0 && client.forEach(element => {
    socket.to(`${element.socketId}`).emit('removeNotifyToClient', msg)
   });

})



   socket.on('disconnect',()=>{
      users=users.filter((user)=>user.socketId!=socket.id)
   })

 }