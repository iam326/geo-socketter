import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, ActionCreator } from 'redux';

import { Message } from '../types';
import { RootState } from '../store/configureStore';
import { actions } from '../actions/chat';
import Chat from '../components/Chat';

interface StateToProps {
  status: string;
  messages: Message[];
}

interface DispatchToProps {
  sendMessage: ActionCreator<void>;
}

export type ChatProps = StateToProps & DispatchToProps;

function ChatContainer(props: ChatProps) {
  const { status, messages, sendMessage } = props;
  return (
    <Chat 
      status={status}
      messages={messages}
      sendMessage={sendMessage}
    />
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
      sendMessage: actions.sendMessage
    }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatContainer);
