import React from 'react';
import { ActionCreator } from 'redux';

import Header from './Header';
import MessageList from './message/MessageList';
import SubmitArea from './SubmitArea';
import { Message } from '../types';

interface Props {
  status: string;
  messages: Message[];
  sendMessage: ActionCreator<void>;
}

export default function Chat(props: Props) {
  return (
    <div>
      <Header />
      <MessageList 
        messages={props.messages}
      />
      <SubmitArea 
        status={props.status}
        sendMessage={props.sendMessage}
      />
    </div>
  );
}
