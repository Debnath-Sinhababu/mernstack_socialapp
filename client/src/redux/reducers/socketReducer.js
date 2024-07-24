import { GLOBALTYPES } from "../GlobalTypes";

const SocketReducer=(state=[],action)=>{
    switch(action.type){
        case GLOBALTYPES.SOCKET:
            return action.payload
          default:
            return state     
            
    }
}
export default SocketReducer