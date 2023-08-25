import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { combineReducers } from 'redux'
import auth from './reducers/authReducer'
import alert from './reducers/alertReducer'
import profile from './reducers/profileReducer'
import status from './reducers/statusReducer'
import HomePost from './reducers/postReducer'
import detailPost from './reducers/detailPostReducer'
import discover from './reducers/DiscoverReducer'
import suggestions from './reducers/SuggestionReducer'
import socket from './reducers/socketReducer'
import notify from './reducers/notifyReducer'
  const rootReducer=combineReducers({
    auth,
    alert,
    profile,
    status,
    HomePost,
    detailPost,
    discover,
    suggestions,
    socket,
    notify
  })
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
)

const DataProvider = ({children}) => {
    return(
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default DataProvider