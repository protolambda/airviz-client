import at from './at';
import redHelper from "../redHelper";

const initialState = {
    showLabels: true
};

const mapping = {
    [at.SHOW_LABELS]: (state, action) => ({
        ...state,
        // make sure it's always a boolean, regardless of input
        showLabels: !!action.showLabels,
    }),
    // TODO more settings
};

const settingsRed = redHelper(mapping, initialState);
export default settingsRed;
