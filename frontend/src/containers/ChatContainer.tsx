import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, ActionCreator } from 'redux';

import { RootState, Message } from '../store/configureStore';
import { actions } from '../actions/chat';
import Chat from '../components/Chat';

interface StateToProps {
  status: string;
  messages: Message[];
}

interface DispatchToProps {
  sendMessage: ActionCreator<void>;
}

type Props = StateToProps & DispatchToProps;

function ChatContainer(props: Props) {
  const { status, messages, sendMessage } = props;
  return (
    <Chat />
  );
}

function mapStateToProps(state: RootState): StateToProps {
  const { chat } = state;
  return {
    status: chat.status,
    messages: chat.messages
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchToProps {
  return bindActionCreators({
      sendMessage: actions.sendMessage.started
    }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatContainer);
