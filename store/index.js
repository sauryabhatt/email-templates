import { applyMiddleware, compose, createStore } from 'redux';
import createRootReducer from './reducers';
import thunk from 'redux-thunk';


const initialState = {};
const enhancers = [];
const middleware = [
    thunk,
];

// if (process.env.NODE_ENV === 'development') {
//     const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

//     if (typeof devToolsExtension === 'function') {
//         enhancers.push(devToolsExtension())
//     }
// }

const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
)

const store = createStore(
    createRootReducer(),
    initialState,
    composedEnhancers
)
export default store;
