import React, { useState, useEffect } from 'react';
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

const googleMapsAPIKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
if (!googleMapsAPIKey) {
  throw "Google Maps API key is not found."
}

function Maps(props: Props) {
  const [destination, setDestination] = useState<google.maps.LatLng | null>(null);

  useEffect(() => {
    runTimer();
  }, [props]);

  const getCurrentPosition = () => {
    return new Promise(
      async (
        resolve: (value?: Geolocation) => void,
        reject: (reason?: PositionError) => void
      ) => {
        await navigator.geolocation.getCurrentPosition(pos => {
          const { latitude, longitude } = pos.coords;
          resolve({
            lat: latitude,
            lon: longitude
          });
        }, reject);
      }
    );
  }

  const sendLocation = async () => {
    const location = await getCurrentPosition();
    props.sendLocation(location);
  }

  const runTimer = (interval = 10000) => {
    const timer = () => {
      setTimeout(async () => {
        if (props.status === 'DONE') {
          await sendLocation();
          timer()
        }
      }, interval)
    }
    timer()
  }
  
  const markDestination = (
    mapProps?: MapProps,
    map?: google.maps.Map,
    event?: any
  ) => {
    const location = event.latLng;
    setDestination(location);
    if (map) {
      map.panTo(location);
    }
}

  return (
    <Map
      google={props.google}
      initialCenter={{
        lat: props.location.lat,
        lng: props.location.lon
      }}
      zoom={15}
      onClick={markDestination}
    >
      <Marker
        name="現在地"
        title="現在地"
        position={{
          lat: props.location.lat,
          lng: props.location.lon
        }}
      />
      {
        destination
          ? <Marker
              position={destination}
            />
          : null
      }
    </Map>
  )
}

export default GoogleApiWrapper({
  apiKey: googleMapsAPIKey
})(Maps);
