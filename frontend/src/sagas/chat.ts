import io from 'socket.io-client';
import { all, call, fork } from 'redux-saga/effects';

const url = 'URL'
function connect() {
  const socket = io(url, {
    path: `/Prod`,
    transports: [
      'websocket',
      'polling',
      'flashsocket'
    ]
  });
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
