import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
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
import RoomItem from './RoomItem';

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

export default function RoomList() {
  const classes = useStyles();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectRoomId, setSelectRoomId] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [roomList, setRoomList] = useState<Array<{
    roomId: string,
    roomName: string,
    createdAt: number
  }>>([]);

  useEffect(() => {
    if (roomList.length === 0) {
      getRoomList();
    }
  }, [])

  const getRoomList = async () => {
    try {
      const response = await API.get('GeoSocketterApi', '/rooms', {});
      setRoomList(response.data);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleChangeName = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewRoomName(event.currentTarget.value);
  };

  const handleCreateRoom = async () => {
    const body = {
      roomId: uuidv4(),
      roomName: newRoomName,
      createdAt: Date.now()
    };
    try {
      await API.post('GeoSocketterApi', '/rooms', { body });
    } catch (err) {
      console.warn(err);
    }
    setRoomList(roomList.concat([body]))
    handleCloseCreateDialog();
  };

  const handleCloseCreateDialog = () => {
    setNewRoomName('');
    setOpenCreateDialog(false);
  };

  const handleLongTap = (id: string) => {
    setSelectRoomId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteRoom = async () => {
    try {
      await API.del('GeoSocketterApi', `/rooms/object/${selectRoomId}`, {});
    } catch (err) {
      console.warn(err);
    }
    const newRoomList = roomList.filter(room => room.roomId !== selectRoomId);
    setRoomList(newRoomList);
    handleCloseDeleteDialog();
  }

  const handleCloseDeleteDialog = () => {
    setSelectRoomId('');
    setOpenDeleteDialog(false);
  };

  const getSelectRoomName = () => {
    if (selectRoomId === '') {
      return '';
    }
    const room = roomList.find(item => item.roomId === selectRoomId);
    return room ? room.roomName : '';
  };

  return (
    <React.Fragment>
      <Header title="Room List" />
      <List className={classes.root}>
        {
          roomList.map(room => (
            <RoomItem
              key={room.roomId}
              id={room.roomId}
              title={room.roomName}
              subTitle={moment(room.createdAt).format('LLL')}
              onLongTap={handleLongTap}
            />
          ))
        }
      </List>
      <Fab
        className={classes.fab}
        color="primary"
        aria-label="add"
        onClick={() => setOpenCreateDialog(true)}
      >
        <AddIcon />
      </Fab>
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        aria-labelledby="form-dialog-title"
        aria-describedby="form-dialog-description"
      >
        <DialogTitle id="form-dialog-title">Create a new room</DialogTitle>
        <DialogContent>
          <DialogContentText id="form-dialog-description">
            To create a new room, enter the room name here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Room Name"
            type="text"
            fullWidth
            value={newRoomName}
            onChange={handleChangeName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateRoom} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{getSelectRoomName()}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete this room ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteRoom} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
