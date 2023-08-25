import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import PageRender from "./PageRender";
import Login from "./pages/login";
import Alert from "./component/alert/Alert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector} from "react-redux";
import Home from "./pages/home";
import { refreshToken } from "./redux/actions/authAction";
import { useEffect } from "react";
import Header from "./component/header/Header";
import Register from "./pages/register";
import ProtectedRouter from "./customRoutes/ProtectedRoute";
import StatusModal from "./component/StatusModal";
import { getPost } from "./redux/actions/postAction";
import { getSuggestions } from "./redux/actions/SuggestionAction";
import  {io } from 'socket.io-client';
import { GLOBALTYPES } from "./redux/GlobalTypes";
import SocketClient from "./component/Home/SocketClient";
import { getNotifies } from "./redux/actions/notifyAction";
function App() {
     const {token,user}=useSelector((state)=>state.auth)
       const {status}=useSelector((state)=>state)
     const dispatch=useDispatch()
     useEffect(()=>{
      !user && dispatch(refreshToken())
       user && dispatch(getPost(user._id,token))
      token && dispatch(getSuggestions(token))
     token && dispatch(getNotifies(token))
     },[token,user])

     useEffect(()=>{
       const socket=io('http://localhost:5000')
         dispatch({type:GLOBALTYPES.SOCKET,payload:socket})
         return () => socket.close()
     },[dispatch])
  return (
    <div className="App">
      <div className="main">
        <Alert />
        {
          token && <Header/>
        }
          {status &&  <StatusModal/>}
          {token && <SocketClient />}
        <Routes>
        
          <Route exact path="/" element={token?<Home/>:<Login />} />
          <Route exact path="/register" element={<Register/>} />
          <Route path="/:page" element={
           <ProtectedRouter>
          <PageRender />
          </ProtectedRouter>
          } />
          <Route path="/:page/:id" element={
           <ProtectedRouter>
           <PageRender />
           </ProtectedRouter>
          
          } />
        
        </Routes>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false} 
          pauseOnHover={false}
          pauseOnFocusLoss={false}   
          draggable
          theme="dark"
        />
      </div>
    </div>
  );
}

export default App;
