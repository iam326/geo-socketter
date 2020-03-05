import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory();

export const locationActions = {
  sendLocation: actionCreator<number>('SEND_LOCATION'),
  sendLocationActions: actionCreator.async<number, void>('SEND_LOCATION_ACTIONS'),
  receiveLocation: actionCreator<number>('RECEIVE_LOCATION')
};
