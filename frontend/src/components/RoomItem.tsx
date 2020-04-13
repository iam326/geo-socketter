import React, { useEffect, useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ChatIcon from '@material-ui/icons/Chat';

interface Props {
  id: string,
  title: string,
  subTitle: string,
  onLongTap: (id: string) => void
}

export default function RoomItem(props: Props) {
  const [startLongPress, setStartLongPress] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (startLongPress) {
      timer = setTimeout(() => {
        props.onLongTap(props.id);
      }, 1000);
    } else if (timer !== null) {
      clearTimeout(timer);
    }
    return () => {
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
  }, [startLongPress])

  return (
    <ListItem
      button
      onMouseDown={() => setStartLongPress(true)}
      onMouseUp={() => setStartLongPress(false)}
      onMouseLeave={() => setStartLongPress(false)}
      onTouchStart={() => setStartLongPress(true)}
      onTouchEnd={() => setStartLongPress(true)}
    >
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
