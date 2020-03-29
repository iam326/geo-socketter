import React from 'react';
import { ActionCreator } from 'redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import MessageList from './message/MessageList';
import SubmitArea from './SubmitArea';
import { Message } from '../types';

interface Props {
  status: string;
  messages: Message[];
  sendMessage: ActionCreator<void>;
  sendLocation: ActionCreator<void>;
  toggleDrawer: () => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: '#ccc',
      minHeight: '250px'
    }
  }),
);

export default function Chat(props: Props) {
  const classes = useStyles();
  const messagesEndRef = React.createRef<HTMLDivElement>()

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div>
      <div className={classes.root}>
        <MessageList 
          messages={props.messages}
        />
        <div ref={messagesEndRef}></div>
      </div>
      <SubmitArea 
        status={props.status}
        sendMessage={props.sendMessage}
        toggleDrawer={props.toggleDrawer}
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
}
