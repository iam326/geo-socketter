import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ChatIcon from '@material-ui/icons/Chat';

import Header from './Header';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

interface Props {
  title: string,
  subTitle: string
}

function RoomItem(props: Props) {
  return (
    <ListItem button>
      <ListItemAvatar>
        <Avatar>
          <ChatIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={props.title}
        secondary={props.subTitle}
      />
    </ListItem>
  );
}

export default function RoomList() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Header title="Room List" />
      <List className={classes.root}>
        <RoomItem title="タイトル" subTitle="サブタイトル" />
        <RoomItem title="タイトル" subTitle="サブタイトル" />
        <RoomItem title="タイトル" subTitle="サブタイトル" />
      </List>
    </React.Fragment>
  );
}
