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

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  constructor(props: Props) {
    super(props);
    this.state = {
      destination: null,
      myLocation: null
    };
    this.displayLocation = this.displayLocation.bind(this);
    this.getCurrentPosition = this.getCurrentPosition.bind(this);
    this.markDestination = this.markDestination.bind(this);
    this.mapsOnReady = this.mapsOnReady.bind(this);
    this.displayRoute = this.displayRoute.bind(this);
  }

  async componentDidMount() {
    this.displayRoute();
    await this.displayLocation();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  mapsOnReady(
    mapProps?: MapProps,
    map?: google.maps.Map
  ) {
    if (map) {
      this.directionsRenderer.setMap(map);
    }
  }

  async displayLocation() {
    try {
      const location = await this.getCurrentPosition();
      this.setState({
        myLocation: location
      });
    } catch(err) {
      console.error(err.message);
    }
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

  displayRoute() {
    this.directionsService.route({
      origin: new google.maps.LatLng(41.8507300, -87.6512600),
      destination: new google.maps.LatLng(41.8525800, -87.6514100),
      travelMode: google.maps.TravelMode.WALKING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result); 
      } else {
        console.error(`error fetching directions ${result}`);
      }
    });
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
        onReady={this.mapsOnReady}
        onClick={this.markDestination}
        mapTypeControl={false}
        fullscreenControl={false}
        streetViewControl={false}
      >
        <Marker
          name="相手の現在地"
          title="相手の現在地"
          position={{
            lat: this.props.location.lat,
            lng: this.props.location.lon
          }}
          icon={{
            url: `${process.env.PUBLIC_URL}/cat.png`,
            scaledSize: new google.maps.Size(48, 48)
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
              icon={{
                url: `${process.env.PUBLIC_URL}/dog.png`,
                scaledSize: new google.maps.Size(48, 48)
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
