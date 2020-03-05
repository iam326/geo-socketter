import { eventChannel } from 'redux-saga';
import { all, call, fork, take, put } from 'redux-saga/effects';
import { chatActions } from '../actions/chat';
import { locationActions } from '../actions/location';

function getWebSocketUri() {
  const uri = process.env.REACT_APP_WEB_SOCKET_URI;
  if (!uri) {
    throw Error('web socket uri not found');
  }
  return uri;
}

function connect() {
  const ws = new WebSocket(getWebSocketUri());
  return new Promise(resolve => {
    ws.onopen = () => {
      resolve(ws);
    };
  });
}

function subscribe(ws: WebSocket) {
  return eventChannel(emit => {
    ws.onmessage = event => {
      switch(event.type) {
        case 'message':
          emit(chatActions.receiveMessage(event.data));
          break;
        default:
          console.log(event.type);
          break;
      }
    }
    return () => {};
  });
}

function* read(ws: WebSocket) {
  const channel = yield call(subscribe, ws);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

function* write(ws: WebSocket) {
  while (true) {
    const { payload } = yield take(chatActions.sendMessage);
    yield put(chatActions.sendMessageActions.started(payload));
    ws.send(JSON.stringify({
      message: 'sendmessage',
      data: payload
    }));
    yield put(chatActions.sendMessageActions.done({params: payload}));
  }
}

function* writeLocation(ws: WebSocket) {
  while (true) {
    const { payload } = yield take(locationActions.sendLocation);
    yield put(locationActions.sendLocationActions.started(payload));
    ws.send(JSON.stringify({
      message: 'sendlocation',
      data: payload
    }));
    yield put(locationActions.sendLocationActions.done({params: payload}));
  }
}

function* handleIO(ws: WebSocket) {
  yield fork(read, ws);
  yield fork(write, ws);
  yield fork(writeLocation, ws);
}

function* watchOnSocket() {
  try {
    const ws = yield call(connect);
    yield fork(handleIO, ws);
  } catch (e) {
    console.error('socket: error:', e);
  }
}

export default function* rootSaga() {
  yield all([
    fork(watchOnSocket)
  ])
}
