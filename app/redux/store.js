import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { authReducer } from './reducers/authReducers';
// import { userReducer } from './reducers/userReducers';
// import { sessionReducer } from './reducers/sessionReducers';
// import { classReducer } from './reducers/classReducers';

const rootReducer = combineReducers({
    authReducer: authReducer,
    // userReducer: userReducer,
    // sessionReducer: sessionReducer,
    // classReducer: classReducer
})

export const store = createStore(rootReducer,(applyMiddleware(thunk)))