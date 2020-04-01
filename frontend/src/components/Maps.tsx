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
  selectedPlace: MarkerProps | null;
  myLocationMarker: google.maps.Marker;
  showingMyInfo: boolean;
  friendLocationMarker: google.maps.Marker;
  showingFriendInfo: boolean;
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
      selectedPlace: null,
      myLocationMarker: new google.maps.Marker(),
      showingMyInfo: false,
      friendLocationMarker: new google.maps.Marker(),
      showingFriendInfo: false
    };
    this.displayLocation = this.displayLocation.bind(this);
    this.getCurrentLocation = this.getCurrentLocation.bind(this);
    this.markDestination = this.markDestination.bind(this);
    this.mapsOnReady = this.mapsOnReady.bind(this);
    this.displayRoute = this.displayRoute.bind(this);
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
      this.displayRoute(
        this.directionsApi.myRouteRenderer,
        new google.maps.LatLng(
          this.state.myLocation.lat,
          this.state.myLocation.lng
        ),
        location
      );
    }
    this.displayRoute(
      this.directionsApi.friendRouteRenderer,
      new google.maps.LatLng(
        this.props.location.lat,
        this.props.location.lng
      ),
      location
    );
  }

  displayRoute(
    directionsRenderer: google.maps.DirectionsRenderer,
    origin: google.maps.LatLng,
    destination: google.maps.LatLng
  ) {
    this.directionsApi.service.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.WALKING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
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
    if (props && marker) {
      const newState = {};
      if (marker.getTitle() === 'MyLocation') {
        Object.assign(newState, { showingMyInfo: !this.state.showingMyInfo });
        if (!this.state.showingMyInfo) {
          Object.assign(newState, { myLocationMarker: marker });
        }
      } else {
        Object.assign(newState, { showingFriendInfo: !this.state.showingFriendInfo });
        if (!this.state.showingFriendInfo) {
          Object.assign(newState, { friendLocationMarker: marker });
        }
      }
      this.setState(newState);
    }
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
            <p>my info window</p>
          </div>
        </InfoWindow>
        <InfoWindow
          marker={this.state.friendLocationMarker}
          visible={this.state.showingFriendInfo}
        >
          <div>
            <p>friend info window</p>
          </div>
        </InfoWindow>
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: googleMapsAPIKey
})(Maps);
