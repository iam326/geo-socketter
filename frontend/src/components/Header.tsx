import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import 'typeface-roboto';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
      flexGrow: 1
    },
    backButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  })
);

export default function Header() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <IconButton edge="start" className={classes.backButton}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            つよぽん
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}
