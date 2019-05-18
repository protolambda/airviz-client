import at from './at';
import redHelper from "../redHelper";

const initialState = {
    paletteType: 'light',
    direction: 'ltr',
};

const mapping = {
    [at.THEME_CHANGE_PALETTE_TYPE]: (state, action) => ({
        ...state,
        paletteType: action.payload.paletteType,
    }),
    [at.THEME_CHANGE_DIRECTION]: (state, action) => ({
        ...state,
        direction: action.payload.direction,
    }),
};

const dataRed = redHelper(mapping, initialState);
export default dataRed;
