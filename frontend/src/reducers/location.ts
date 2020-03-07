import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { LocationState } from '../store/configureStore';
import { locationActions } from '../actions/location';

const initialState: LocationState = {
  status: '',
  location: 0
};

const locationReducer = reducerWithInitialState(initialState)
  .case(locationActions.sendLocationActions.started, state => {
    return state;
  })
  .case(locationActions.sendLocationActions.done, state => {
    return state;
  })
  .case(locationActions.sendLocationActions.failed, state => {
    alert('error!');
    return state;
  })
  .case(locationActions.receiveLocation, (state, payload) => {
    console.log(payload);
    return Object.assign({}, state, {
      location: payload
    })
  });

export default locationReducer;
