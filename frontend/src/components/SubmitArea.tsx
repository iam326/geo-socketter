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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      top: 'auto',
      bottom: 0,
      backgroundColor: '#eee'
    },
    form: {
      flexGrow: 1
    },
    input: {
      backgroundColor: '#eee',
    },
    sendButton: {
      marginLeft: theme.spacing(2)
    },
  }),
);

interface Props {
  status: string;
  sendMessage: ActionCreator<void>;
}
export default function SubmitArea(props: Props) {
  const classes = useStyles();
  const [message, setMessage] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleClick = () => {
    if (message.length > 0) {
      props.sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div>
      <AppBar position="fixed" elevation={0} className={classes.root}>
        <Toolbar>
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
            />
          </form>
          <IconButton
           edge="end"
           className={classes.sendButton}
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
