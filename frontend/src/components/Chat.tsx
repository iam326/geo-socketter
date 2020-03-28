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
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: '#ccc',
      height: '400px'
    }
  }),
);

export default function Chat(props: Props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
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
