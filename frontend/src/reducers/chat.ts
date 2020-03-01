import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { ChatState } from '../store/configureStore';
import { actions } from '../actions/chat';

const initialState: ChatState = {
  status: 'NONE',
  inbox: [],
  outbox: []
};

const chatReducer = reducerWithInitialState(initialState)
  .case(actions.sendMessage.done, state => {
    return state;
  })
  .case(actions.sendMessage.failed, state => {
    alert('error!');
    return state;
  });

export default chatReducer;
