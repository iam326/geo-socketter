import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, ActionCreator } from 'redux';

import { RootState } from '../store/configureStore';
import { actions } from '../actions/chat';
import Chat from '../components/Chat';

interface StateToProps {
  status: string;
  inbox: string[];
  outbox: string[];
}

interface DispatchToProps {
  sendMessage: ActionCreator<void>;
}

type Props = StateToProps & DispatchToProps;

function ChatContainer(props: Props) {
  const { status, inbox, outbox, sendMessage } = props;
  return (
    <Chat />
  );
}

function mapStateToProps(state: RootState): StateToProps {
  const { chat } = state;
  return {
    status: chat.status,
    inbox: chat.inbox,
    outbox: chat.outbox
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
