import "regenerator-runtime/runtime";
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { AppContainer as ReactHotLoader } from "react-hot-loader";
import {Provider} from "react-redux";
import App from "./components/App";
import storeCreator from "./reducers/store";

const store = storeCreator();

const render = Component => {
    ReactDOM.render(
        <ReactHotLoader>
            <Provider store={store}>
                <Router>
                    <Component />
                </Router>
            </Provider>
        </ReactHotLoader>,
        document.getElementById('root'),
    );
};

render(App);

if (module.hot) {
    module.hot.accept('./components/App', () => { {
        const Next = require("./components/App").default;
        render(Next)
    } })
}
