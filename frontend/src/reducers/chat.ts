import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { ChatState } from '../store/configureStore';
import { actions } from '../actions/chat';
import { Message } from '../types';

const initialState: ChatState = {
  status: 'NONE',
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
  .case(actions.sendMessageActions.started, state => {
    return Object.assign({}, state, {
      status: 'REQUEST'
    });
  })
  .case(actions.sendMessageActions.done, (state, action) => {
    const message: Message = {
      value: action.params,
      direction: 'USER',
      timestamp: 0
    }
    return Object.assign({}, state, {
      status: '',
      messages: state.messages.concat(message)
    })
  })
  .case(actions.sendMessageActions.failed, state => {
    alert('error!');
    return state;
  });

export default chatReducer;
