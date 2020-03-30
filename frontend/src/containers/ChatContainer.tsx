import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, ActionCreator } from 'redux';

import { Message } from '../types';
import { RootState } from '../store/configureStore';
import { chatActions } from '../actions/chat';
import Chat from '../components/Chat';

import { locationActions } from '../actions/location';

interface StateToProps {
  status: string;
  messages: Message[];
}

interface DispatchToProps {
  sendMessage: ActionCreator<void>;
  sendLocation: ActionCreator<void>;
}

export type ChatProps = StateToProps & DispatchToProps;

function ChatContainer(props: ChatProps) {
  const { status, messages, sendMessage, sendLocation } = props;
  return (
    <Chat
      status={status}
      messages={messages}
      sendMessage={sendMessage}
      sendLocation={sendLocation}
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
      sendMessage: chatActions.sendMessage,
      sendLocation: locationActions.sendLocation
    }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatContainer);
