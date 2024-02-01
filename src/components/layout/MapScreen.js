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
import { toastOptions } from '../../utils/error';

const defaultLocation = { lat: 20.796484, lng: 85.02297779999999 };
const libs = ['places'];

export default function MapScreen(props) {
  const { dispatch: ctxDispatch } = useContext(Store);
  const [center, setCenter] = useState(defaultLocation);
  const [location, setLocation] = useState(center);
  const [locName, setLocName] = useState();
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

  console.log({ center })
  useEffect(() => {
    getUserCurrentLocation();

    ctxDispatch({ type: 'SET_FULLBOX_ON' });
  }, [ctxDispatch]);

  useEffect(() => {
    if (props.currentLoc) {
      setCenter(props.currentLoc);
      setLocation(props.currentLoc);
    }
  }, [props.currentLoc])

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
    console.log({ place })
    placeRef.current = place;
  };

  const onPlacesChanged = () => {
    console.log("PLACES", placeRef.current.getPlaces())
    const place = placeRef.current.getPlaces()[0];
    const loc = place.geometry.location;
    setCenter({ lat: loc.lat(), lng: loc.lng() });
    setLocation({ lat: loc.lat(), lng: loc.lng() });
    setLocName(place.formatted_address);
  };

  const onMarkerLoad = (marker) => {
    markerRef.current = marker;
  };

  const onConfirm = () => {
    if (!locName) {
      const getAddress = (lat, long, apiKey) => {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`).then(res => {
          return res.json();
        }).then(({ results }) => {
          console.log({ results });

          setLocName(results[0]?.formatted_address);
          props.setLocation(location, results[0]?.formatted_address);
        })
      }

      // getAddress(location.lat, location.lng, "AIzaSyB_I6ZXsXxpyAndkWBRWUJEMxsqKWVhGpo"); // sahil
      getAddress(location.lat, location.lng, "AIzaSyDUrV14G1tu4GtcpMA6-ydY5ZL55j5_gLk");

    } else {
      console.log({ location });
      props.setLocation(location, locName);
    }
    const places = placeRef.current.getPlaces() || [{}];
    toast.success('location selected successfully.');
  };

  return (
    <div className="full-box">
      {/* <LoadScript libraries={libs} googleMapsApiKey="AIzaSyB_I6ZXsXxpyAndkWBRWUJEMxsqKWVhGpo"> // sahil */}
      <LoadScript libraries={libs} googleMapsApiKey="AIzaSyDUrV14G1tu4GtcpMA6-ydY5ZL55j5_gLk">
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