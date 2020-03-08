import React from 'react';
import 'typeface-roboto';
import { ActionCreator } from 'redux';
import GoogleMapReact from 'google-map-react';

import { Geolocation } from '../types';

interface Props {
  status: string;
  location: Geolocation;
  sendLocation: ActionCreator<void>;
}

export default function Maps(props: Props) {
  const googleMapsAPIKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  if (!googleMapsAPIKey) {
    throw "Google Maps API key is not found."
  }

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
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: googleMapsAPIKey
        }}
        defaultCenter={{
          lat: props.location.lat,
          lng: props.location.lon
        }}
        defaultZoom={15}
      >
      </GoogleMapReact>
    </div>
  )
}
