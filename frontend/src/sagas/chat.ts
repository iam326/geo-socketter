import io from 'socket.io-client';
import { all, call, fork } from 'redux-saga/effects';

function getWebSocketUri() {
  const uri = process.env.REACT_APP_WEB_SOCKET_URI;
  if (!uri) {
    throw Error('web socket uri not found');
  }
  return uri;
}

function connect() {
  const socket = io(
    getWebSocketUri(), {
      path: `/Prod`,
      transports: [
        'websocket',
        'polling',
        'flashsocket'
      ]
    }
  );
  return new Promise(resolve => {
    socket.on('connect', () => {
      resolve(socket);
    });
  });
}

function* watchOnSocket() {
  while (true) {
    try {
      yield call(connect)
    } catch (e) {
      console.error('socket: error:', e);
    }
  }
}

export default function* rootSaga() {
  yield all([
    fork(watchOnSocket)
  ])
}
