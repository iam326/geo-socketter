import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import 'typeface-roboto';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Button from '@material-ui/core/Button';
import { Auth } from 'aws-amplify';

interface Props {
  title: string;
  onClickBack?: () => void;
}

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

export default function Header(props: Props) {
  const classes = useStyles();
  const signOut = async (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    await Auth.signOut();
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          {
            props.onClickBack &&
              <IconButton
                edge="start"
                className={classes.backButton}
                onClick={props.onClickBack}
              >
                <ArrowBackIosIcon />
              </IconButton>
          }
          <Typography variant="h6" className={classes.title}>
            {props.title}
          </Typography>
          <Button
            color="inherit"
            onClick={signOut}
          >
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}
