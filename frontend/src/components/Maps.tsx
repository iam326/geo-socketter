import React from 'react';
import 'typeface-roboto';
import { ActionCreator } from 'redux';
import { GoogleApiWrapper, Map, Marker, MapProps } from 'google-maps-react';

import { Geolocation } from '../types';

interface Props {
  google: any;
  status: string;
  location: Geolocation;
  sendLocation: ActionCreator<void>;
}

interface State {
  destination: google.maps.LatLng | null;
  myLocation: Geolocation | null;
}

const googleMapsAPIKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
if (!googleMapsAPIKey) {
  throw "Google Maps API key is not found."
}

class Maps extends React.Component<Props, State> {

  timer = setInterval(async () => {
    await this.displayLocation();
  }, 10000);

  constructor(props: Props) {
    super(props);
    this.state = {
      destination: null,
      myLocation: null
    };
    this.displayLocation = this.displayLocation.bind(this);
    this.getCurrentPosition = this.getCurrentPosition.bind(this);
    this.markDestination = this.markDestination.bind(this);
  }

  async componentDidMount() {
    await this.displayLocation();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  async displayLocation() {
    const location = await this.getCurrentPosition();
    this.props.sendLocation(location);
    this.setState({
      myLocation: location
    });
  }

  getCurrentPosition() {
    return new Promise(
      async (
        resolve: (value?: Geolocation) => void,
        reject: (reason?: PositionError) => void
      ) => {
        navigator.geolocation.getCurrentPosition(pos => {
          const { latitude, longitude } = pos.coords;
          resolve({
            lat: latitude,
            lon: longitude
          });
        }, reject);
      }
    );
  }
  
  markDestination(
    mapProps?: MapProps,
    map?: google.maps.Map,
    event?: any
  ) {
    const location = event.latLng;
    this.setState({
      destination: location
    });
    if (map) {
      map.panTo(location);
    }
}

  render() {
    return (
      <Map
        google={this.props.google}
        initialCenter={{
          lat: this.props.location.lat,
          lng: this.props.location.lon
        }}
        zoom={15}
        onClick={this.markDestination}
      >
        <Marker
          name="相手の現在地"
          title="相手の現在地"
          position={{
            lat: this.props.location.lat,
            lng: this.props.location.lon
          }}
        />
        {
          this.state.myLocation
          ? <Marker
              name="自分の現在地"
              title="自分の現在地"
              position={{
                lat: this.state.myLocation.lat,
                lng: this.state.myLocation.lon
              }}
            />
          : null
        }
        {
          this.state.destination
            ? <Marker
                position={this.state.destination}
              />
            : null
        }
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: googleMapsAPIKey
})(Maps);
