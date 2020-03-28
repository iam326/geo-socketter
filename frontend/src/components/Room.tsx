import React from 'react';

import Header from './Header';
import MapsContainer from '../containers/MapsContainer';
import ChatContainer from '../containers/ChatContainer';

export default function Room() {
  return (
    <div>
      <Header />
      <MapsContainer />
      {/* <ChatContainer /> */}
    </div>
  );
}
