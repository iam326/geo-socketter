import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import 'typeface-roboto';
import ListItem from '@material-ui/core/ListItem';
import RightBubble from './RightBubble';

interface Props {
  children: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      justifyContent: 'flex-end'
    }
  }),
);

export default function UserMessage(props: Props) {
  const classes = useStyles();

  return (
    <ListItem className={classes.item}>
      <RightBubble>{props.children}</RightBubble>
  </ListItem>
  );
}