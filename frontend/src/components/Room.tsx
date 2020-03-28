import React from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import Header from './Header';
import MapsContainer from '../containers/MapsContainer';
import ChatContainer from '../containers/ChatContainer';

export default function Room() {
  const [state, setState] = React.useState({
    isOpen: false
  });
  const toggleDrawer = () => (event: any) => {
    if (event && event.type === 'keydown' &&
       (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, isOpen: !state.isOpen });
  };
  return (
    <div>
      <Header />
      <MapsContainer />
      <SwipeableDrawer
        anchor={'bottom'}
        open={state.isOpen}
        onClose={toggleDrawer()}
        onOpen={toggleDrawer()}
      >
        <ChatContainer />
      </SwipeableDrawer>
    </div>
  );
}
