import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { LocationState } from '../store/configureStore';
import { locationActions } from '../actions/location';

const initialState: LocationState = {
  status: 'DONE',
  location: {
    lat: 35.681236,
    lng: 139.767125
  }
};

const locationReducer = reducerWithInitialState(initialState)
  .case(locationActions.sendLocationActions.started, state => {
    return Object.assign({}, state, {
      status: 'STARTED'
    });
  })
  .case(locationActions.sendLocationActions.done, state => {
    return Object.assign({}, state, {
      status: 'DONE'
    });
  })
  .case(locationActions.sendLocationActions.failed, state => {
    alert('error!');
    return Object.assign({}, state, {
      status: 'FAILED'
    });
  })
  .case(locationActions.receiveLocation, (state, payload) => {
    return state.location.lat !== payload.lat || state.location.lat !== payload.lng
      ? Object.assign({}, state, {
          location: payload
        })
      : state;
  });

export default locationReducer;
