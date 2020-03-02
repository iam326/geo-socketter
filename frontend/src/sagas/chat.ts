import { put, takeEvery, delay } from 'redux-saga/effects';

import { actions } from '../actions/chat';

export type SendMessageStarted = ReturnType<typeof actions.sendMessageActions.started>

export function* async(action: SendMessageStarted) {
  yield put(actions.sendMessageActions.started(action.payload));
  yield delay(1000);
  yield put(actions.sendMessageActions.done({params: action.payload}));
}

export default function* rootSaga() {
  yield takeEvery(actions.sendMessage, async)
}
