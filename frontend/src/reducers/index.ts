import { combineReducers, Reducer } from 'redux';

import { RootState } from '../store/configureStore';
import chatReducer from './chat';
import locationReducer from './location';

const reducer: Reducer<RootState> = combineReducers({
  chat: chatReducer,
  location: locationReducer
});

export default reducer;
