import { all, fork } from 'redux-saga/effects';
import graphSaga from './graph/saga';

export default function* root() {
    yield all([
        fork(graphSaga)
        // TODO: more sagas?
    ]);
}
