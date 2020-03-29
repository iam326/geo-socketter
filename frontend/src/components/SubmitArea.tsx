import React from 'react';
import { ActionCreator } from 'redux';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import 'typeface-roboto';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import SyncIcon from '@material-ui/icons/Sync';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      top: 'auto',
      bottom: 0,
      backgroundColor: '#eee'
    },
    form: {
      flexGrow: 1,
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1)
    },
    input: {
      backgroundColor: '#eee',
    }
  }),
);

interface Props {
  status: string;
  sendMessage: ActionCreator<void>;
  toggleDrawer: () => void;
}
export default function SubmitArea(props: Props) {
  const classes = useStyles();
  const [message, setMessage] = React.useState('');
  const [direction, setDirection] = React.useState('up');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleClick = () => {
    if (message.length > 0) {
      props.sendMessage(message);
      setMessage('');
    }
  };

  const handleFocus = () => {
    if (direction === 'up') {
      handleExpandClick();
    }
  };

  const handleExpandClick = () => {
    setDirection(direction === 'up' ? 'down' : 'up');
    props.toggleDrawer();
  };

  return (
    <div>
      <AppBar position="fixed" elevation={0} className={classes.root}>
        <Toolbar>
          <IconButton
           edge="start"
           onClick={handleExpandClick}
          >
            {
              direction === 'up'
                ? <ExpandLessIcon />
                : <ExpandMoreIcon />
            }
          </IconButton>
          <form className={classes.form} noValidate autoComplete="off">
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              multiline
              rowsMax="4"
              InputProps={{
                className: classes.input
              }}
              value={message}
              onChange={handleChange}
              onFocus={handleFocus}
            />
          </form>
          <IconButton
           edge="end"
           onClick={handleClick}
          >
            {
              props.status === 'REQUEST'
                ? <SyncIcon />
                : <SendIcon />
            }
            
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
