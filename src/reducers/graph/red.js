import at from './at';
import redHelper from "../redHelper";

const initialState = {
    viewport: {
        time: 0,
        length: 100
    },
    graphs: {
        blocks: {} // key: time slot, value: list of items (can be empty)
    },
    ws: {
        status: 'closed',
        timestamp: 0
    }
};

const mapping = {
    [at.CHANGE_VIEWPORT]: (state, {time, length}) => ({
        ...state,
        viewport: {time, length}
    }),
    [at.GRAPH_WS_UPDATE]: (state, {status, timestamp}) => ({
        ...state,
        ws: {
            status,
            timestamp
        },
    }),
    [at.ADD_DATA]: (state, {topic, time, height, data}) => ({
        ...state,
        graphs: {
            ...state.graphs,
            [topic]: {
                ...state.graphs[topic],
                [time]: {
                    ...state.graphs[topic][time],
                    [height]: data
                }
            }
        }
    })
};

const graphRed = redHelper(mapping, initialState);
export default graphRed;
