import {
    put, takeLatest, takeEvery, select, call,
} from 'redux-saga/effects';
import { OPEN, CLOSE, MESSAGE, SEND } from 'redux-websocket-bridge';

import at from "./at";
import {topics, topicToName} from "./topics";


function sendBuf(buf) {
    return {
        type: `@@websocket/${ SEND }`,
        payload: buf
    };
}

function arr2hex(arr) {
    return Array.prototype.map.call(arr, x => ('00' + x.toString(16)).slice(-2)).join('');
}

function* updateStatus(topic) {
    const {viewport, g} = yield select((state) => ({viewport: state.graph.viewport, data: state.graph.graphs[topic.name]}));
    const buf = new ArrayBuffer(1 + 4 + (viewport.length * 4));
    const topicView = new Uint8Array(buf, 0, 1);
    topicView[0] = topic;
    const timeView   = new Uint32Array(buf, 5, 1);
    timeView[0] = viewport.time;
    const countsView   = new Uint32Array(buf, 5);
    for (let i = 0; i < viewport.length; i++) {
        const atIndex = g[i + viewport.time];
        countsView[i] = Object.keys(atIndex).length;
    }
    const debugView = new Uint8Array(buf);
    console.log("sending status message for topic ", topic, " msg: ", debugView);
    yield put(sendBuf(buf));
}

function* changeViewport() {
    yield call(updateStatus, topics.BLOCKS);
}

function* processRawMsg({buf}) {
    // TODO parse message, add data to graph using ADD_DATA
    console.log('raw msg: ', buf);
    const debugView = new Uint8Array(buf);
    console.log('received msg: ', debugView);
    const topicView = new Uint8Array(buf, 0, 1);
    const topic = topicView[0];
    const topicName = topicToName(topic);
    const b4View = new Uint32Array(buf, 1, 2);
    const time = b4View[0];
    const height = b4View[1];
    const parentKey = arr2hex(new Uint8Array(buf, 9, 32));
    const selfKey = arr2hex(new Uint8Array(buf, 41, 32));
    // TODO deserialize value bytes

    yield put({type: at.ADD_DATA, topic: topicName, height: height, time: time, data: 'todo', parentKey: parentKey, selfKey: selfKey});
}

function* websocketHandling(action) {
    const time = ~~(Date.now() / 1000);
    switch (action.type) {
        case `@@websocket/${ OPEN }`:
            yield put({type: at.GRAPH_WS_UPDATE, status: 'open', timestamp: time});
            break;

        case `@@websocket/${ CLOSE }`:
            yield put({type: at.GRAPH_WS_UPDATE, status: 'closed', timestamp: time});
            break;

        case `@@websocket/${ MESSAGE }`:
            // Process the raw message here, either string, ArrayBuffer, or Blob
            yield put({type: at.RAW_MSG, msg: action.payload.message});
            break;

        default: break;
    }
}

function* graphSaga() {
    yield takeLatest(at.CHANGE_VIEWPORT, changeViewport);
    yield takeLatest(action => action.type.startsWith('@@websocket'), websocketHandling);
    yield takeEvery(at.RAW_MSG, processRawMsg);
}

export default graphSaga;
