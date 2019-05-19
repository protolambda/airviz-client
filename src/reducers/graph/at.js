const graphAT = {
    // start the realtime graph
    START_GRAPH: 'START_GRAPH',
    // when the graph connection changes
    GRAPH_WS_UPDATE: 'GRAPH_WS_UPDATE',
    // when there is a raw message to process
    BLOB_MSG: 'BLOB_MSG',
    // to add new graph data to the store
    ADD_DATA: 'ADD_DATA',
    // triggers: local viewport adjustment, sends viewport change to server
    CHANGE_VIEWPORT: 'CHANGE_VIEWPORT',
    // triggers: send the status (viewport + known amount of data) to the server
    UPDATE_STATUS: 'UPDATE_STATUS',
    // when there is a msg to send
    WS_SEND: 'WS_SEND',
    // TODO: filter data, visibility toggles
    // TODO: force cleanup data
};

export default graphAT;
