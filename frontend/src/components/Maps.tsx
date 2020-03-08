import React from 'react';
import 'typeface-roboto';
import { ActionCreator } from 'redux';
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';

import { Geolocation } from '../types';

interface Props {
  google: any;
  status: string;
  location: Geolocation;
  sendLocation: ActionCreator<void>;
}

const googleMapsAPIKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
if (!googleMapsAPIKey) {
  throw "Google Maps API key is not found."
}

function Maps(props: Props) {
  const getCurrentPosition = () => {
    return new Promise(
      (
        resolve: (value?: Position) => void,
        reject: (reason?: PositionError) => void
      ) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    );
  }

  const sendLocation = async () => {
    const pos = await getCurrentPosition();
    const { latitude, longitude } = pos.coords;
    const location: Geolocation = {
      lat: latitude,
      lon: longitude
    }
    props.sendLocation(location);
  }

  return (
    <Map
      google={props.google}
      initialCenter={{
        lat: props.location.lat,
        lng: props.location.lon
      }}
      zoom={15}>
      <Marker
        name="現在地"
        title="現在地"
        position={{
          lat: props.location.lat,
          lng: props.location.lon
        }}
      />
    </Map>
  )
}

export default GoogleApiWrapper({
  apiKey: googleMapsAPIKey
})(Maps);
