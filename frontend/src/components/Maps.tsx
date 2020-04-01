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
  activeMarker: google.maps.Marker;
  showingInfoWindow: boolean;
  activeMarker2: google.maps.Marker;
  showingInfoWindow2: boolean;
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
  directionsRenderer2 = new google.maps.DirectionsRenderer();

  constructor(props: Props) {
    super(props);
    this.state = {
      destination: null,
      myLocation: null,
      selectedPlace: null,
      activeMarker: new google.maps.Marker(),
      showingInfoWindow: false,
      activeMarker2: new google.maps.Marker(),
      showingInfoWindow2: false
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
      this.directionsRenderer.setOptions(options);
      this.directionsRenderer.setMap(map);
      this.directionsRenderer2.setOptions(options);
      this.directionsRenderer2.setMap(map);
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
        this.directionsRenderer,
        new google.maps.LatLng(
          this.props.location.lat,
          this.props.location.lng
        ),
        location
      );
    }
    this.displayRoute(
      this.directionsRenderer2,
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
    this.directionsService.route({
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
      const state = {};
      if (marker.getTitle() === '自分の現在地') {
        Object.assign(state, { showingInfoWindow: !this.state.showingInfoWindow });
        if (!this.state.showingInfoWindow) {
          Object.assign(state, { activeMarker: marker });
        }
      } else {
        Object.assign(state, { showingInfoWindow2: !this.state.showingInfoWindow2 });
        if (!this.state.showingInfoWindow2) {
          Object.assign(state, { activeMarker2: marker });
        }
      }
      this.setState(state);
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
          name="相手の現在地"
          title="相手の現在地"
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
              name="自分の現在地"
              title="自分の現在地"
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
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
        >
          <div>
            <p>hoge</p>
          </div>
        </InfoWindow>
        <InfoWindow
          marker={this.state.activeMarker2}
          visible={this.state.showingInfoWindow2}
        >
          <div>
            <p>foobar</p>
          </div>
        </InfoWindow>
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: googleMapsAPIKey
})(Maps);
