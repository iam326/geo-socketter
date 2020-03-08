import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { LocationState } from '../store/configureStore';
import { locationActions } from '../actions/location';

const initialState: LocationState = {
  status: '',
  location: {
    lat: 35.681236,
    lon: 139.767125
  }
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
    return state.location.lat !== payload.lat || state.location.lat !== payload.lon
      ? Object.assign({}, state, {
          location: payload
        })
      : state;
  });

export default locationReducer;
