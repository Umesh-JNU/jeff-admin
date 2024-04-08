import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  useJsApiLoader,
  Marker,
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
  Polyline,
  BicyclingLayer
} from '@react-google-maps/api';
import { socket } from '../../utils/socket';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt } from "react-icons/fa";
import LoadingBox from './LoadingBox';

// const defaultLocation = { lat: 45.516, lng: -73.56 };
const defaultLocation = { lat: 24.7913957, lng: 85.0002336 };
const libs = ['places'];
const API_KEY = "AIzaSyDUrV14G1tu4GtcpMA6-ydY5ZL55j5_gLk";

const pathlist = [
  {
    "location": {
      "latitude": 24.798616223069555,
      "longitude": 85.024756485436086
    },
    "originalIndex": 0,
    "placeId": "ChIJIxI4OPUp8zkRzZX2m2IukE0"
  },
  {
    "location": {
      "latitude": 24.7985764,
      "longitude": 85.024755399999989
    },
    "placeId": "ChIJIxI4OPUp8zkRzZX2m2IukE0"
  },
  {
    "location": {
      "latitude": 24.7985764,
      "longitude": 85.024755399999989
    },
    "placeId": "ChIJWQLjL_Up8zkRm7MOYHqREC4"
  },
  {
    "location": {
      "latitude": 24.798643999999996,
      "longitude": 85.024930099999992
    },
    "placeId": "ChIJWQLjL_Up8zkRm7MOYHqREC4"
  },
  {
    "location": {
      "latitude": 24.798643999999996,
      "longitude": 85.024930099999992
    },
    "placeId": "ChIJpb38L_Up8zkRzUVDh1_3iEo"
  },
  {
    "location": {
      "latitude": 24.7987274,
      "longitude": 85.02514579999999
    },
    "placeId": "ChIJpb38L_Up8zkRzUVDh1_3iEo"
  },
  {
    "location": {
      "latitude": 24.798738099999998,
      "longitude": 85.0251876
    },
    "placeId": "ChIJpb38L_Up8zkRzUVDh1_3iEo"
  },
  {
    "location": {
      "latitude": 24.798738099999998,
      "longitude": 85.0251876
    },
    "placeId": "ChIJpb38L_Up8zkRCk2Ro9WIF_c"
  },
  {
    "location": {
      "latitude": 24.798820099999997,
      "longitude": 85.025515099999993
    },
    "placeId": "ChIJpb38L_Up8zkRCk2Ro9WIF_c"
  },
  {
    "location": {
      "latitude": 24.798861699999996,
      "longitude": 85.025693699999991
    },
    "placeId": "ChIJpb38L_Up8zkRCk2Ro9WIF_c"
  },
  {
    "location": {
      "latitude": 24.798861699999996,
      "longitude": 85.025693699999991
    },
    "placeId": "ChIJuw6ML_Up8zkRsn0JHnQSUFs"
  },
  {
    "location": {
      "latitude": 24.798899400000003,
      "longitude": 85.025855499999992
    },
    "placeId": "ChIJuw6ML_Up8zkRsn0JHnQSUFs"
  },
  {
    "location": {
      "latitude": 24.798899400000003,
      "longitude": 85.025855499999992
    },
    "placeId": "ChIJDXW32fQp8zkR3db8kCred6I"
  },
  {
    "location": {
      "latitude": 24.7989081,
      "longitude": 85.025893
    },
    "placeId": "ChIJDXW32fQp8zkR3db8kCred6I"
  },
  {
    "location": {
      "latitude": 24.7989294,
      "longitude": 85.0260334
    },
    "placeId": "ChIJDXW32fQp8zkR3db8kCred6I"
  },
  {
    "location": {
      "latitude": 24.7989294,
      "longitude": 85.0260334
    },
    "placeId": "ChIJDXW32fQp8zkRJt9_dm32160"
  },
  {
    "location": {
      "latitude": 24.798938,
      "longitude": 85.0260899
    },
    "placeId": "ChIJDXW32fQp8zkRJt9_dm32160"
  },
  {
    "location": {
      "latitude": 24.7989522,
      "longitude": 85.0264303
    },
    "placeId": "ChIJDXW32fQp8zkRJt9_dm32160"
  },
  {
    "location": {
      "latitude": 24.7989522,
      "longitude": 85.0264303
    },
    "placeId": "ChIJ36qPwvQp8zkRdMI9WpPW1I8"
  },
  {
    "location": {
      "latitude": 24.798989404353719,
      "longitude": 85.02644794112561
    },
    "originalIndex": 2,
    "placeId": "ChIJ36qPwvQp8zkRdMI9WpPW1I8"
  }
];

export default function LiveMap({ source, dest }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    libraries: libs
  });
  console.log({ source, dest });
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
      setFrom({ lat: pathlist[0].location.latitude, lng: pathlist[0].location.longitude });
      setTo({ lat: pathlist[pathlist.length - 1].location.latitude, lng: pathlist[pathlist.length - 1].location.longitude });
      // setTo({ lat: dest.lat, lng: dest.long });
      // setFrom({ lat: source.lat, lng: source.long });
      // setCenter({ lat: source.lat, lng: source.long });
    }
  }, [source?.lat, dest?.lat]);

  useEffect(() => {
    console.log("IN USE-EFFECT");
    const newLocation = (loc) => {
      console.log({ loc });
      const [lat, lng, _] = loc.split(',');
      // setCenter({
      //   lat: parseFloat(lat),
      //   lng: parseFloat(lng)
      // });
    }

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
    socket.on('new-location', newLocation);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, [socket]);

  console.log({ center });

  return (isLoaded ?
    <div className="full-box" style={{ border: '1px solid #aaa' }}>
      {/* <LoadScript libraries={libs} googleMapsApiKey="AIzaSyB_I6ZXsXxpyAndkWBRWUJEMxsqKWVhGpo"> // sahil */}
      {/* <LoadScript libraries={libs} googleMapsApiKey={API_KEY}> */}
      <GoogleMap
        id="sample-map"
        center={center}
        zoom={20}
        heading={pathlist[pathlist.length - 1].location}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        onLoad={(map) => { mapRef.current = map; }}
        options={{
          // zoomControl: false,
          // streetViewControl: false,
          // mapTypeControl: false,
          // fullscreenControl: false,
        }}
      >
        {/* {response !== null && (
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
        />} */}

        {from && to && <>
          <Marker position={from} icon={{ url: "/pickup.png" }} />
          <Marker position={to} icon={{ url: "/drop.png" }} />

          <Polyline
            path={[center, to]}
            options={{
              strokeColor: '#007aff', strokeOpacity: 0.8, strokeWeight: 4
            }}
          />
        </>}
        <BicyclingLayer />
        {center && <>
          <Marker position={center} onLoad={(marker) => markerRef.current = marker}
            icon={{ url: "/truck.png" }}
          />
          <Polyline
            path={[defaultLocation, center]}
            options={{ strokeColor: '#b0b0b0', strokeOpacity: 0.8, strokeWeight: 4 }}
          />
        </>}
      </GoogleMap>
      {/* </LoadScript> */}
    </div> : <LoadingBox />
  );
};