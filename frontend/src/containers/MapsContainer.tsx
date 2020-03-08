import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, ActionCreator } from 'redux';

import { Geolocation } from '../types';
import { RootState } from '../store/configureStore';
import { locationActions } from '../actions/location';
import Maps from '../components/Maps';

interface StateToProps {
  status: string;
  location: Geolocation;
}

interface DispatchToProps {
  sendLocation: ActionCreator<void>;
}

export type MapsProps = StateToProps & DispatchToProps;

function MapsContainer(props: MapsProps) {
  const { status, location, sendLocation } = props;
  return (
    <Maps
      status={status}
      location={location}
      sendLocation={sendLocation}
    />
  );
}

function mapStateToProps(state: RootState): StateToProps {
  const { location } = state;
  return {
    status: location.status,
    location: location.location
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchToProps {
  return bindActionCreators({
      sendLocation: locationActions.sendLocation
    }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapsContainer);
