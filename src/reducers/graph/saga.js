import {
    put, takeLatest, takeEvery, select, call, take,
} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';

import at from "./at";
import {topics, topicToName} from "./topics";
import ReconnectingWebSocket from "reconnecting-websocket";


const blobToBuffer = (blob) => new Response(blob).arrayBuffer();

function makeWsCh(rws) {
    console.log("making websocket channel!");
    return eventChannel(emitter => {
        console.log("setting up websocket channel!");
        rws.addEventListener('close', (msg) => {
            // console.log('Websocket closed!');
            const time = ~~(Date.now() / 1000);
            emitter({type: at.GRAPH_WS_UPDATE, status: 'closed', timestamp: time});
        });
        rws.addEventListener('open', (msg) => {
            // console.log('Websocket opened!');
            const time = ~~(Date.now() / 1000);
            emitter({type: at.GRAPH_WS_UPDATE, status: 'open', timestamp: time});
        });
        rws.addEventListener('message', (msg) => {
            // console.log('msg received!', msg);
            emitter({type: at.RAW_MSG, buf: msg.data});
        });
        return () => {
            rws.close();
        };
    });
}

function* handleWsSend(m, ws) {
    console.log("handling ws send: ", m, ws);
    ws.send(m.msg);
}

function arr2hex(arr) {
    return Array.prototype.map.call(arr, x => ('00' + x.toString(16)).slice(-2)).join('');
}

function* updateStatus(topic) {
    const {viewport, g} = yield select((state) => ({viewport: state.graph.viewport, data: state.graph.graphs[topic.name]}));
    const buf = new ArrayBuffer(4 + 4 + (viewport.length * 4));
    const headerView = new Uint32Array(buf, 0, 8);
    headerView[0] = topic;
    headerView[1] = viewport.time;
    const countsView   = new Uint32Array(buf, 8);
    for (let i = 0; i < viewport.length; i++) {
        const atIndex = g[i + viewport.time];
        countsView[i] = atIndex === undefined ? 0 : Object.keys(atIndex).length;
    }
    const debugView = new Uint8Array(buf);
    console.log("sending status message for topic ", topic, " msg: ", debugView);
    yield put(handleWsSend, {msg: buf});
}

function* changeViewport() {
    yield call(updateStatus, topics.BLOCKS);
}

function* processRawMsg({buf}) {
    if (buf.byteLength < 96) {
        console.log("msg too short!");
        return;
    }
    const headerView = new Uint32Array(buf, 0, 3);
    const topic = headerView[0];
    const topicName = topicToName(topic);
    const time = headerView[1];
    const height = headerView[2];
    const parentKey = arr2hex(new Uint8Array(buf, 32, 32));
    const selfKey = arr2hex(new Uint8Array(buf, 64, 32));
    if (parentKey === '0000000000000000000000000000000000000000000000000000000000000000') {
        console.log("null parent: ", selfKey);
    }
    // TODO deserialize value bytes

    yield put({type: at.ADD_DATA, topic: topicName, height: height, time: time, data: 'todo', parentKey: parentKey, selfKey: selfKey});
}

function* graphSaga() {
    console.log("graph saga");
    yield takeLatest(at.CHANGE_VIEWPORT, changeViewport);
    const rws = new ReconnectingWebSocket('ws://localhost:4000/ws', [], {debug: true});
    rws.binaryType = 'arraybuffer';
    const wsCh = makeWsCh(rws);
    yield takeEvery(at.RAW_MSG, processRawMsg);
    yield takeEvery(at.WS_SEND, handleWsSend, rws);

    while (true) {
        const payload = yield take(wsCh);
        yield put(payload)
    }
}

export default graphSaga;
