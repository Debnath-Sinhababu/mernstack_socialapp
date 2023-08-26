import { DeleteData } from "../actions/GlobalTypes"
import { POST_TYPES } from "../actions/postAction"

const initialState={
    posts:[],
    loading:false,
    result:0,
    page:2

}
const postReducer=(state=initialState,action)=>{

       switch(action.type){
       case POST_TYPES.CREATE_POST:
        console.log(action.payload)
        return {
            ...state,
            loading:false,
            posts:[action.payload,...state.posts]
        }
        case POST_TYPES.LOADING:
        return {
          ...state,
            loading:action.payload
        }
        case POST_TYPES.GET_POSTS:
            return {
                ...state,
                loading: false,
                 posts: action.payload.posts,
                 result: action.payload.result,
                 page:action.payload.page || state.page
            }
            case POST_TYPES.UPDATE_POST:
                return {
                    ...state,
                    loading:false,
                    posts:state.posts.map(post=>post._id===action.payload._id?action.payload:post)
                }
                case POST_TYPES.DELETE_POST:
                    return {
                        ...state,
                        posts: DeleteData(state.posts, action.payload._id)
                    };
        default:
            return state

       }

}
export default postReducer