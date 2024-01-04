import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  LoadScript,
  GoogleMap,
  StandaloneSearchBox,
  Marker,
} from '@react-google-maps/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../../states/store';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

const defaultLocation = { lat: 45.516, lng: -73.56 };
const libs = ['places'];

export default function MapScreen(props) {
  const { dispatch: ctxDispatch } = useContext(Store);
  const [center, setCenter] = useState(defaultLocation);
  const [location, setLocation] = useState(center);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);

  const mapRef = useRef(null);
  const placeRef = useRef(null);
  const markerRef = useRef(null);

  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by this browser');
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  };

  useEffect(() => {
    getUserCurrentLocation();

    ctxDispatch({
      type: 'SET_FULLBOX_ON',
    });
  }, [ctxDispatch]);

  const onLoad = (map) => {
    mapRef.current = map;
  };

  const onIdle = () => {
    setLocation({
      lat: mapRef.current.center.lat(),
      lng: mapRef.current.center.lng(),
    });
  };

  const onLoadPlaces = (place) => {
    placeRef.current = place;
  };

  const onPlacesChanged = () => {
    const place = placeRef.current.getPlaces()[0].geometry.location;
    setCenter({ lat: place.lat(), lng: place.lng() });
    setLocation({ lat: place.lat(), lng: place.lng() });
  };

  const onMarkerLoad = (marker) => {
    markerRef.current = marker;
  };

  const onConfirm = () => {
    const places = placeRef.current.getPlaces() || [{}];

    props.setLat(location.lat)
    props.setLong(location.lng)

    const getAddress = (lat, long, apiKey) => {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`).then(res => {
        return res.json();
      }).then(({ results }) => { props.setAddr(results[0]?.formatted_address); })
    }

    getAddress(location.lat, location.lng, "AIzaSyDa1XtUxehWQu0ifml5AYWYs9a5iVp4AZA");

    toast.success('location selected successfully.');
  };

  return (
    <div className="full-box">
      <LoadScript libraries={libs} googleMapsApiKey="AIzaSyDa1XtUxehWQu0ifml5AYWYs9a5iVp4AZA">
        <GoogleMap
          id="sample-map"
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={center}
          zoom={15}
          onLoad={onLoad}
          // onCenterChanged={onConfirm}
          onIdle={onIdle}
        >
          <StandaloneSearchBox
            onLoad={onLoadPlaces}
            onPlacesChanged={onPlacesChanged}
          >
            <div className="map-input-box">
              <input type="text" placeholder="Enter your address" className='form-control'></input>
              <Button type="button" onClick={onConfirm}>
                Confirm
              </Button>
            </div>
          </StandaloneSearchBox>
          <Marker position={location} onLoad={onMarkerLoad}></Marker>
        </GoogleMap>
      </LoadScript>
    </div>



  );
}