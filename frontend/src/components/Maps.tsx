import React from 'react';
import 'typeface-roboto';
import { ActionCreator } from 'redux';
import {
  GoogleApiWrapper,
  Map,
  Marker,
  InfoWindow,
  MapProps,
  MarkerProps
} from 'google-maps-react';

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
  myLocationMarker: google.maps.Marker;
  showingMyInfo: boolean;
  distanceFromMyLocationToDestination: string;
  distanceFromMyLocationToDuration: string;
  friendLocationMarker: google.maps.Marker;
  showingFriendInfo: boolean;
  distanceFromFriendLocationToDestination: string;
  distanceFromFriendLocationToDuration: string;
}

const googleMapsAPIKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
if (!googleMapsAPIKey) {
  throw "Google Maps API key is not found."
}

class Maps extends React.Component<Props, State> {

  timer = setInterval(async () => {
    await this.displayLocation();
  }, 10000);

  directionsApi = {
    service: new google.maps.DirectionsService(),
    myRouteRenderer: new google.maps.DirectionsRenderer(),
    friendRouteRenderer: new google.maps.DirectionsRenderer()
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      destination: null,
      myLocation: null,
      myLocationMarker: new google.maps.Marker(),
      showingMyInfo: false,
      distanceFromMyLocationToDestination: '',
      distanceFromMyLocationToDuration: '',
      friendLocationMarker: new google.maps.Marker(),
      showingFriendInfo: false,
      distanceFromFriendLocationToDestination: '',
      distanceFromFriendLocationToDuration: ''
    };
    this.displayLocation = this.displayLocation.bind(this);
    this.getCurrentLocation = this.getCurrentLocation.bind(this);
    this.getMyLocationLatLng = this.getMyLocationLatLng.bind(this);
    this.getFriendLocationLatLng = this.getFriendLocationLatLng.bind(this);
    this.markDestination = this.markDestination.bind(this);
    this.mapsOnReady = this.mapsOnReady.bind(this);
    this.getDirectionsRoute = this.getDirectionsRoute.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
  }

  async componentDidMount() {
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
      const options = {
        suppressMarkers: true,
        suppressInfoWindows: true,
        preserveViewport: true
      };
      this.directionsApi.myRouteRenderer.setOptions(options);
      this.directionsApi.myRouteRenderer.setMap(map);
      this.directionsApi.friendRouteRenderer.setOptions(options);
      this.directionsApi.friendRouteRenderer.setMap(map);
    }
  }

  async displayLocation() {
    try {
      const location = await this.getCurrentLocation();
      //this.props.sendLocation(location);
      this.setState({
        myLocation: location
      });
    } catch(err) {
      console.error(err.message);
    }
  }

  getMyLocationLatLng() {
    if (!this.state.myLocation) { return null; }
    return new google.maps.LatLng(
      this.state.myLocation.lat,
      this.state.myLocation.lng
    );
  }

  getFriendLocationLatLng() {
    return new google.maps.LatLng(
      this.props.location.lat,
      this.props.location.lng
    );
  }

  getCurrentLocation() {
    return new Promise(
      async (
        resolve: (value?: Geolocation) => void,
        reject: (reason?: PositionError) => void
      ) => {
        navigator.geolocation.getCurrentPosition(pos => {
          const { latitude, longitude } = pos.coords;
          resolve({ lat: latitude, lng: longitude });
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

    if (this.state.myLocation) {
      this.getDirectionsRoute(
        this.getMyLocationLatLng() as google.maps.LatLng,
        location,
        result => {
          this.directionsApi.myRouteRenderer.setDirections(result);
        }
      );
    }
    this.getDirectionsRoute(
      this.getFriendLocationLatLng(),
      location,
      result => {
        this.directionsApi.friendRouteRenderer.setDirections(result);
      }
    );
  }

  getDirectionsRoute(
    origin: google.maps.LatLng,
    destination: google.maps.LatLng,
    callback: (
      result: google.maps.DirectionsResult
    ) => void
  ) {
    this.directionsApi.service.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.WALKING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        callback(result);
      } else {
        console.error(`error fetching directions ${result}`);
      }
    });
  }

  onMarkerClick(
    props?: MarkerProps,
    marker?: google.maps.Marker,
    event?: any
  ) {
    if (!props || !marker || !this.state.destination) { 
      return;
    }

    let fromLocation: google.maps.LatLng;
    let getDirectionsRouteCallback: ((result: google.maps.DirectionsResult) => void);
    if (marker.getTitle() === 'MyLocation') {
      if (this.state.showingMyInfo) { return; }
      fromLocation = this.getMyLocationLatLng() as google.maps.LatLng;
      getDirectionsRouteCallback = result => {
        const dest = result.routes[0].legs[0].distance.text;
        const duration = result.routes[0].legs[0].duration.text;
        this.setState({
          myLocationMarker: marker,
          showingMyInfo: true,
          distanceFromMyLocationToDestination: dest,
          distanceFromMyLocationToDuration: duration
        });
        setTimeout(() => this.setState({ showingMyInfo: false }), 5000);
      };
    } else {
      if (this.state.showingFriendInfo) { return; }
      fromLocation = this.getFriendLocationLatLng();
      getDirectionsRouteCallback = result => {
        const dest = result.routes[0].legs[0].distance.text;
        const duration = result.routes[0].legs[0].duration.text;
        this.setState({
          friendLocationMarker: marker,
          showingFriendInfo: true,
          distanceFromFriendLocationToDestination: dest,
          distanceFromFriendLocationToDuration: duration
        });
        setTimeout(() => this.setState({ showingFriendInfo: false }), 5000);
      };
    }

    this.getDirectionsRoute(
      fromLocation,
      this.state.destination,
      getDirectionsRouteCallback
    );
  }

  render() {
    return (
      <Map
        google={this.props.google}
        initialCenter={{
          lat: this.props.location.lat,
          lng: this.props.location.lng
        }}
        zoom={15}
        onReady={this.mapsOnReady}
        onClick={this.markDestination}
        mapTypeControl={false}
        fullscreenControl={false}
        streetViewControl={false}
      >
        <Marker
          title="FriendLocation"
          position={this.props.location}
          icon={{
            url: `${process.env.PUBLIC_URL}/cat.png`,
            scaledSize: new google.maps.Size(48, 48)
          }}
          onClick={this.onMarkerClick}
        />
        {
          this.state.myLocation
          ? <Marker
              title="MyLocation"
              position={this.state.myLocation}
              icon={{
                url: `${process.env.PUBLIC_URL}/dog.png`,
                scaledSize: new google.maps.Size(48, 48)
              }}
              onClick={this.onMarkerClick}
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
        <InfoWindow
          marker={this.state.myLocationMarker}
          visible={this.state.showingMyInfo}
        >
          <div>
            <div>{this.state.distanceFromMyLocationToDestination}</div>
            <div>{this.state.distanceFromMyLocationToDuration}</div>
          </div>
        </InfoWindow>
        <InfoWindow
          marker={this.state.friendLocationMarker}
          visible={this.state.showingFriendInfo}
        >
          <div>
            <div>{this.state.distanceFromFriendLocationToDestination}</div>
            <div>{this.state.distanceFromFriendLocationToDuration}</div>
          </div>
        </InfoWindow>
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: googleMapsAPIKey
})(Maps);
