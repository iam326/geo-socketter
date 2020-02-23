import React from 'react';
import './App.css';

import Header from './components/Header';
import MessageList from './components/message/MessageList';
import SubmitArea from './components/SubmitArea';

function App() {
  return (
    <div className="App">
      <Header />
      <MessageList />
      <SubmitArea />
    </div>
  );
}

export default App;
