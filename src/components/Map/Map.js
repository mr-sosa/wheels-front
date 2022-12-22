import React, { useEffect, useState } from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from '@react-google-maps/api';
import './Map.scss';
import GPS_img from './../../assets/gps.png';

const GOOGLE_MAPS_TOKEN = process.env.REACT_APP_GOOGLE_MAPS_TOKEN;

const bogota = { lat: 4.60971, lng: -74.08175 };

export const Map = (props) => {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  async function calculateRoute() {
    if (props.origin === '' || props.destiantion === '') {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: props.origin,
      destination: props.destination,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  // Geolocation Permissions
  let userPosition = bogota;
  const [map, setMap] = useState(/** @type google.maps.Map*/ (null));

  function success(position) {
    userPosition.lat = position.coords.latitude;
    userPosition.lng = position.coords.longitude;
  }

  function error() {
    alert('Unable to retrieve your location');
  }

  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }

  useEffect(() => {
    console.log(props.origin);
    console.log(props.destination);
    calculateRoute();
  }, [calculateRoute]);

  // Google Maps

  return (
    <>
      <div className="Map">
        <GoogleMap
          center={userPosition === bogota ? bogota : userPosition}
          zoom={17}
          mapContainerStyle={{
            width: '35vw',
            height: '100vh',
            borderBottomRightRadius: 8,
            background:
              'linear-gradient(180deg, rgba(29, 45, 68, 0) 50%, #1D2D44 92.6%)',
          }}
          options={{
            mapId: '6d581fda42e1c25d',
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker className="Marker" position={userPosition} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
        <button
          className="Center-GPS"
          aria-label="GPS position"
          onClick={() => map.panTo(userPosition)}
        >
          <img src={GPS_img} alt="GPS icon" />
        </button>
      </div>
    </>
  );
};
