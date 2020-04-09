import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ChatIcon from '@material-ui/icons/Chat';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { v4 as uuidv4 } from 'uuid';
import { API } from 'aws-amplify';
import moment from 'moment';

import Header from './Header';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
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
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [roomList, setRoomList] = useState<Array<{
    roomId: string,
    roomName: string,
    createdAt: number
  }>>([]);

  useEffect(() => {
    getRoomList();
  }, [])

  const getRoomList = async () => {
    try {
      const response = await API.get('GeoSocketterApi', '/rooms', {});
      setRoomList(response.data);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setName(event.currentTarget.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = async () => {
    try {
      await API.post('GeoSocketterApi', '/rooms', {
        body: {
          roomId: uuidv4(),
          roomName: name,
          createdAt: Date.now()
        }
      });
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <React.Fragment>
      <Header title="Room List" />
      <List className={classes.root}>
        {
          roomList.map(room => (
            <RoomItem
              key={room.roomId}
              title={room.roomName}
              subTitle={moment(room.createdAt).format('LLL')}
            />
          ))
        }
      </List>
      <Fab
        className={classes.fab}
        color="primary"
        aria-label="add"
        onClick={handleClickOpen}
      >
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create a new room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new room, enter the room name here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Room Name"
            type="text"
            fullWidth
            value={name}
            onChange={handleChangeName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
