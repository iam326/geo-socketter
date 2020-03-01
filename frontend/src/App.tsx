import React from 'react';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import ChatContainer from './containers/ChatContainer';

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <ChatContainer />
    </Provider>
  );
}

export default App;
