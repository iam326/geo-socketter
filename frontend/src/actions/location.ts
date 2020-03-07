import actionCreatorFactory from 'typescript-fsa';

import { Geolocation } from '../types';

const actionCreator = actionCreatorFactory();

export const locationActions = {
  sendLocation: actionCreator<Geolocation>('SEND_LOCATION'),
  sendLocationActions: actionCreator.async<Geolocation, void>('SEND_LOCATION_ACTIONS'),
  receiveLocation: actionCreator<Geolocation>('RECEIVE_LOCATION')
};
