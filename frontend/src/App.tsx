import React from 'react';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import Room from './components/Room';

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <Room />
    </Provider>
  );
}

export default App;
