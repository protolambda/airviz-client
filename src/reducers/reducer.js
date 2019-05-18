import {combineReducers} from 'redux'
import settingsReducer from "./settings/red";
import themeReducer from "./theme/red";
import graphReducer from "./graph/red";

const reducer = combineReducers({
    settings: settingsReducer,
    theme: themeReducer,
    graph: graphReducer
});

export default reducer;
