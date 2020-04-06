import React from 'react';

import Header from './Header';
import MapsContainer from '../containers/MapsContainer';
import ChatContainer from '../containers/ChatContainer';

export default function Room() {
  const onClick = () => {
    alert('back');
  };
  return (
    <div>
      <Header title="つよぽん" onClickBack={onClick}/>
      <MapsContainer />
      <ChatContainer />
    </div>
  );
}
