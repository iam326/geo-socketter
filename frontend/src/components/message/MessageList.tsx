import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import UserMessage from './UserMessage';
import FriendMessage from './FriendMessage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      marginTop: '8px'
    }
  }),
);

export default function MessageList() {
  const classes = useStyles();

  return (
    <div>
      <List className={classes.list}>
        <FriendMessage>こんにちは。高橋さん。</FriendMessage>
        <UserMessage>こんにちは。つよぽんさん。</UserMessage>
      </List>
    </div>
  );
}