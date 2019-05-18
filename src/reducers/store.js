import {createStore, applyMiddleware, compose} from 'redux';
import reducer from './reducer';
import saga from './saga';
import createSagaMiddleware from 'redux-saga';
import ReconnectingWebSocket from 'reconnecting-websocket';

import ReduxWebSocketBridge from 'redux-websocket-bridge';

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();


const wsMiddleware = ReduxWebSocketBridge(
    () => new ReconnectingWebSocket('ws://localhost:4000/', [], {debug: true}),
    {binaryType: 'arraybuffer', unfold: false});


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
                ),
                applyMiddleware(
                    wsMiddleware
                )
            )
        );
    }

    window.myStore = store;

    sagaMiddleware.run(saga);

    return store;

}
