import React from 'react';

import Header from './Header';
import MessageList from './message/MessageList';
import SubmitArea from './SubmitArea';

export default function Chat() {
  return (
    <div>
      <Header />
      <MessageList />
      <SubmitArea />
    </div>
  );
}
