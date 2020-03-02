import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory();

export const actions = {
  sendMessage: actionCreator<string>('SEND_MESSAGE'),
  sendMessageActions: actionCreator.async<string, void>('SEND_MESSAGE_ACTIONS')
};
