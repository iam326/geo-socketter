import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import Header from './Header';
import MapsContainer from '../containers/MapsContainer';
import ChatContainer from '../containers/ChatContainer';

const drawerHeight = 260;

const useStyles = makeStyles(theme => ({
  drawer: {
    height: drawerHeight,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    height: drawerHeight,
    transition: theme.transitions.create('height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    height: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      height: theme.spacing(9) + 1,
    },
  }
}));

export default function Room() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  return (
    <div>
      <Header />
      <MapsContainer />
      <Drawer
        variant="permanent"
        anchor={'bottom'}
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <ChatContainer
          toggleDrawer={toggleDrawer}
        />
      </Drawer>
    </div>
  );
}
