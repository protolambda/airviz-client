import at from './at';
import redHelper from "../redHelper";

const initialState = {
    viewport: {
        time: 0,
        length: 100
    },
    graphs: {
        // key: time slot, value: list of items (can be empty)
        blocks: {
            0: {
                0: {
                    value: 'abc',
                    parentKey: '0000000000000000000000000000000000000000000000000000000000000000',
                    selfKey: 'a'
                },
                1: {
                    value: 'foo',
                    parentKey: '0000000000000000000000000000000000000000000000000000000000000000',
                    selfKey: 'b'
                }
            },
            1: {
                0: {
                    value: '12345',
                    parentKey: 'a',
                    selfKey: 'c'
                },
            },
            2: {
                0: {
                    value: 'dvsgfheth',
                    parentKey: 'c',
                    selfKey: 'd'
                },
                1: {
                    value: 'bwsafdgfsrg',
                    parentKey: 'b',
                    selfKey: 'e'
                },
            }
        }
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
    [at.ADD_DATA]: (state, {topic, time, height, data, parentKey, selfKey}) => {
        const atIndex = state.graphs[topic][time];
        const ks = Object.keys(atIndex);
        if (ks.length !== height) {
            console.log("received out-of-order data, ignoring it.");
            return state;
        }
        return ({
            ...state,
            graphs: {
                ...state.graphs,
                [topic]: {
                    ...state.graphs[topic],
                    [time]: {
                        ...state.graphs[topic][time],
                        [height]: {
                            value: data,
                            parentKey,
                            selfKey
                        }
                    }
                }
            }
        })
    }
};

const graphRed = redHelper(mapping, initialState);
export default graphRed;
