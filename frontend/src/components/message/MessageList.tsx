import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import UserMessage from './UserMessage';
import FriendMessage from './FriendMessage';
import { Message } from '../../types'

interface Props {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#ccc',
      height: '180px',
      maxHeight: '250px',
      overflow: 'scroll'
    },
    ref: {
      height: '0px'
    }
  }),
);

export default function MessageList(props: Props) {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {
        props.messages.map((msg: Message, i: number) => (
          msg.direction === 'USER'
            ? <UserMessage key={i}>{msg.value}</UserMessage>
            : <FriendMessage key={i}>{msg.value}</FriendMessage>
        ))
      }
      <div
        className={classes.ref}
        ref={props.messagesEndRef}
      />
    </List>
  );
}