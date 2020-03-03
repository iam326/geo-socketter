import { combineReducers, Reducer } from 'redux';

import { RootState } from '../store/configureStore';
import chatReducer from './chat';

const reducer: Reducer<RootState> = combineReducers({
  chat: chatReducer
});

export default reducer;
