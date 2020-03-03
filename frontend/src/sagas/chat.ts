import { all, call, fork } from 'redux-saga/effects';

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

function* watchOnSocket() {
  try {
    yield call(connect);
  } catch (e) {
    console.error('socket: error:', e);
  }
}

export default function* rootSaga() {
  yield all([
    fork(watchOnSocket)
  ])
}
