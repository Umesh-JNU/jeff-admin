import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Marker,
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from '@react-google-maps/api';
import { socket } from '../../utils/socket';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt } from "react-icons/fa";

// const defaultLocation = { lat: 45.516, lng: -73.56 };
const defaultLocation = { lat: 24.7913957, lng: 85.0002336 };
const libs = ['places'];
const API_KEY = "AIzaSyDUrV14G1tu4GtcpMA6-ydY5ZL55j5_gLk";

export default function LiveMap({ source, dest }) {
  const { id } = useParams();

  const [to, setTo] = useState();
  const [from, setFrom] = useState();
  const [response, setResponse] = useState(null);
  const [center, setCenter] = useState(defaultLocation);

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    if (source && dest) {
      setTo({ lat: dest.lat, lng: dest.long });
      setFrom({ lat: source.lat, lng: source.long });
    }
  }, [source?.lat, dest?.lat]);

  useEffect(() => {
    console.log("IN USE-EFFECT");

    function onConnect() {
      console.log("CONNECTED")
      setIsConnected(true);
    }

    function onDisconnect(reason) {
      console.log("DIS-CONNECTED", reason)
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents(previous => [...previous, value]);
    }

    console.log({ socket });
    socket.emit('join-room', id, (res) => {
      if (res.status === 'OK') {
        console.log('successfully connected...');
      }
    });

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new-location', (loc) => {
      console.log({ loc });
      setCenter(loc);
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, [socket]);

  console.log({ center });

  return (
    <div className="full-box" style={{ border: '1px solid #aaa' }}>
      {/* <LoadScript libraries={libs} googleMapsApiKey="AIzaSyB_I6ZXsXxpyAndkWBRWUJEMxsqKWVhGpo"> // sahil */}
      <LoadScript libraries={['places']} googleMapsApiKey={API_KEY}>
        <GoogleMap
          id="sample-map"
          mapContainerStyle={{ height: '100%', width: '100%' }}
          // center={center}
          onLoad={(map) => { mapRef.current = map; }}
          zoom={15}
        // options={{ zoomControl: true }}
        >
          {response !== null && (
            <DirectionsRenderer
              options={{
                directions: response,
              }}
            />
          )}

          {from && to && response === null && <DirectionsService
            options={{
              origin: from,
              destination: to,
              travelMode: 'DRIVING',
            }}
            callback={(res) => {
              // console.log({ res })
              if (res && res.status === 'OK') {
                setResponse(res);
              }
            }}
          />}
          {center && <Marker position={center} onLoad={(marker) => markerRef.current = marker} yellow />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};