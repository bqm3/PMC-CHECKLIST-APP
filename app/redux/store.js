import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { authReducer } from './reducers/authReducers';
import { entReducer } from './reducers/entReducers';
// import { sessionReducer } from './reducers/sessionReducers';
// import { classReducer } from './reducers/classReducers';

const rootReducer = combineReducers({
    authReducer: authReducer,
    entReducer: entReducer,
    // sessionReducer: sessionReducer,
    // classReducer: classReducer
})

export const store = createStore(rootReducer,(applyMiddleware(thunk)))