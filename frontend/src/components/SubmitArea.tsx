import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import 'typeface-roboto';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

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

export default function BottomAppBar() {
  const classes = useStyles();

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
            />
          </form>
          <IconButton edge="end" className={classes.sendButton}>
            <SendIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
