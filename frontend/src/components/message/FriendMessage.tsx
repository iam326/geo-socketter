import React from 'react';
import 'typeface-roboto';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import LeftBubble from './LeftBubble';

interface Props {
  children: string;
}

export default function FriendMessage(props: Props) {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar alt="" src="" />
      </ListItemAvatar>
      <LeftBubble>{props.children}</LeftBubble>
  </ListItem>
  );
}