import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { ChatState } from '../store/configureStore';
import { chatActions } from '../actions/chat';
import { Message } from '../types';

const initialState: ChatState = {
  status: 'SEND_MESSAGE_DONE',
  messages: [
    {
      value: 'こんにちは、つよぽんさん。',
      direction: 'USER',
      timestamp: 0
    },
    {
      value: 'こんにちは、たかはしさん。',
      direction: 'FRIEND',
      timestamp: 1
    }
  ]
};

const chatReducer = reducerWithInitialState(initialState)
  .case(chatActions.sendMessageActions.started, state => {
    return Object.assign({}, state, {
      status: 'SEND_MESSAGE_STARTED'
    });
  })
  .case(chatActions.sendMessageActions.done, (state, action) => {
    const message: Message = {
      value: action.params,
      direction: 'USER',
      timestamp: 0
    }
    return Object.assign({}, state, {
      status: 'SEND_MESSAGE_DONE',
      messages: state.messages.concat(message)
    });
  })
  .case(chatActions.sendMessageActions.failed, state => {
    alert('error!');
    return state;
  })
  .case(chatActions.receiveMessage, (state, payload) => {
    const message: Message = {
      value: payload,
      direction: 'FRIEND',
      timestamp: 0
    }
    return Object.assign({}, state, {
      status: 'SEND_MESSAGE_FAILED',
      messages: state.messages.concat(message)
    })
  });

export default chatReducer;
