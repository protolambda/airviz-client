import {createStore, applyMiddleware, compose} from 'redux';
import reducer from './reducer';
import saga from './saga';
import createSagaMiddleware from 'redux-saga';

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();

const initialState = {};

export default () => {

    let store = null;

    if (window.myStore) {
        store = window.myStore;
    } else {
        store = createStore(
            reducer,
            initialState,
            composeEnhancers(
                applyMiddleware(
                    sagaMiddleware
                )
            )
        );
    }

    window.myStore = store;

    sagaMiddleware.run(saga);

    return store;

}
