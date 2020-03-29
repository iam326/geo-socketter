import React from 'react';
import { ActionCreator } from 'redux';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import clsx from 'clsx';

import MessageList from './message/MessageList';
import SubmitArea from './SubmitArea';
import { Message } from '../types';

interface Props {
  status: string;
  messages: Message[];
  sendMessage: ActionCreator<void>;
  sendLocation: ActionCreator<void>;
}

const drawerHeight = 'auto';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      height: drawerHeight,
      flexShrink: 0,
      whiteSpace: 'nowrap'
    },
    drawerOpen: {
      height: drawerHeight,
      transition: theme.transitions.create('height', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      zIndex: 1
    },
    drawerClose: {
      transition: theme.transitions.create('height', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      height: 0,
      [theme.breakpoints.up('sm')]: {
        height: 0
      },
      zIndex: 1
    },
    bottom: {
      height: '64px'
    }
  })
);

export default function Chat(props: Props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const messagesEndRef = React.createRef<HTMLDivElement>()

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div>
      <div>
        <Drawer
          anchor={'bottom'}
          variant='permanent'
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
          <MessageList 
            messages={props.messages}
            messagesEndRef={messagesEndRef}
          />
          <div className={classes.bottom}></div>
        </Drawer>
      </div>
      <SubmitArea 
        status={props.status}
        sendMessage={props.sendMessage}
        toggleDrawer={toggleDrawer}
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
}
