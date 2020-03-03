import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import 'typeface-roboto';

interface Props {
  children: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bubble: {
      position: 'relative',
      display: 'inline-block',
      margin: '0 12px 0 0',
      padding: '10px 12px',
      minWidth: '120px',
      maxWidth: '100%',
      color: '#555',
      background: '#e0edff',
      borderRadius: '8px',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '100%',
        marginTop: '-8px',
        border: '8px solid transparent',
        borderLeft: '20px solid #e0edff'
      }
    },
    msg: {
      margin: 0,
      padding: 0
    }
  }),
);

export default function RightBubble(props: Props) {
  const classes = useStyles();

  return (
    <div className={classes.bubble}>
      <p className={classes.msg}>{props.children}</p>
    </div>
  );
}