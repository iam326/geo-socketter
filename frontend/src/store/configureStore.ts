import { Action, createStore, applyMiddleware, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

import { Message, Geolocation } from '../types'
import reducer from '../reducers';
import rootSaga from '../sagas/chat';

export interface ChatState {
  status: string;
  messages: Message[]
}

export interface LocationState {
  status: string;
  location: Geolocation;
}

export interface RootState {
  chat: ChatState;
  location: LocationState;
}

export default function configureStore(initial_state?: any) {
  const sagaMiddleware = createSagaMiddleware();
  const store: Store<RootState, Action>  = createStore(
    reducer,
    initial_state,
    applyMiddleware(
      sagaMiddleware, logger
    )
  );

  sagaMiddleware.run(rootSaga);

  return store;
}
