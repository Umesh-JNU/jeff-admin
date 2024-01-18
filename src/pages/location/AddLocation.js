import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";

import { ToastContainer, toast } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, AddForm, MapScreen } from "../../components";
import { Col, Row } from "react-bootstrap";
import { toastOptions } from "../../utils/error";

export default function AddLocation() {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, error, success }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const locationData = {
    name: "",
    lat: "",
    long: ""
  };

  const [info, setInfo] = useState(locationData);

  const resetForm = () => {
    setInfo(locationData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // if (!locationImage) {
    //   toast.warning("Please select an image or wait till image is uploaded.", toastOptions);
    //   return;
    // }

    await create(dispatch, token, info);
    resetForm();
  };

  useTitle("Create Location");
  return (
    <AddForm
      title="Add Location"
      data={info}
      setData={() => { }}
      inputFieldProps={[]}
      submitHandler={submitHandler}
      target="/admin/locations"
      successMessage="Location Created Successfully!"
      reducerProps={{ loading, error, success, dispatch }}
    >
      <h6>Select Location</h6>
      <div
        className="mb-3"
        style={{
          border: "1px solid #ced4da",
          borderRadius: "0.25rem",
        }}
      >
        <MapScreen
          setLocation={(location, name) => setInfo({
            lat: location.lat,
            long: location.lng,
            name
          })}
        />
        {console.log("INFO", info)}
        {info && info.lat && info.long && info.name ? (
          <Row>
            <Col lg={3}>
              <p className="p-bold">LAT: {info.lat}</p>
            </Col>
            <Col lg={3}>
              <p className="p-bold">LNG: {info.long}</p>
            </Col>
            <Col lg={6}>
              <p className="p-bold">Location: {info.name}</p>
            </Col>
          </Row>
        ) : (
          <div>
            <p className="p-bold">No Location</p>
          </div>
        )}
      </div>
      <ToastContainer />
    </AddForm>
  );
}