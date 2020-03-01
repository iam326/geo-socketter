import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory();

export const actions = {
  sendMessage: actionCreator.async<string, void>('SEND_MESSAGE')
};
