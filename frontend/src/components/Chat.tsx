import React from 'react';
import { ActionCreator } from 'redux';

import Header from './Header';
import MessageList from './message/MessageList';
import SubmitArea from './SubmitArea';
import { Message, Geolocation } from '../types';

interface Props {
  status: string;
  messages: Message[];
  sendMessage: ActionCreator<void>;
  sendLocation: ActionCreator<void>;
}

export default function Chat(props: Props) {

  const getCurrentPosition = () => {
    return new Promise(
      (
        resolve: (value?: Position) => void,
        reject: (reason?: PositionError) => void
      ) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    );
  }

  const handleClick = async () => {
    const pos = await getCurrentPosition();
    const { latitude, longitude } = pos.coords;
    const location: Geolocation = {
      lat: latitude,
      lon: longitude
    }
    props.sendLocation(location);
  }

  return (
    <div>
      <Header />
      <MessageList 
        messages={props.messages}
      />
      <button onClick={handleClick}>hoge</button>
      <SubmitArea 
        status={props.status}
        sendMessage={props.sendMessage}
      />
    </div>
  );
}
