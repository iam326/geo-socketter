import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import UserMessage from './UserMessage';
import FriendMessage from './FriendMessage';
import { Message } from '../../types'

interface Props {
  messages: Message[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: '57px'
    },
    list: {
      marginTop: '8px'
    }
  }),
);

export default function MessageList(props: Props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List className={classes.list}>
        {
          props.messages.map((msg: Message, i: number) => (
            msg.direction === 'USER'
              ? <UserMessage key={i}>{msg.value}</UserMessage>
              : <FriendMessage key={i}>{msg.value}</FriendMessage>
          ))
        }
      </List>
    </div>
  );
}