import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";

import { ToastContainer, toast } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, AddForm } from "../../components";
import { Row, Col } from "react-bootstrap";
import MapScreen from "./../../components/layout/MapScreen";

export default function AddMill() {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, error, success }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const millData = {
    mill_name: "",
    name: "",
    lat: "",
    long: "",
  };
  const millAttr = [
    {
      type: "text",
      col: 12,
      props: {
        label: "Name",
        name: "mill_name",
        maxLength: 50,
        minLength: 4,
        required: true,
      },
    },
  ];
  const [info, setInfo] = useState(millData);

  const resetForm = () => {
    setInfo(millData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await create(dispatch, token, info);
    resetForm();
  };
  useTitle("Create Mill");
  return (
    <AddForm
      title="Add Mill"
      data={info}
      setData={setInfo}
      inputFieldProps={millAttr}
      submitHandler={submitHandler}
      target="/admin/mills"
      successMessage="Mill Created Successfully!"
      reducerProps={{ loading, error, success, dispatch }}
    >
      <h6>Select Address</h6>
      <div
        className="mb-3"
        style={{
          border: "1px solid #ced4da",
          borderRadius: "0.25rem",
        }}
      >
        <MapScreen
          setLocation={(location, name) => {
            console.log({ location, name });
            setInfo((prev) => {
              return {
                ...prev,
                name,
                lat: location.lat,
                long: location.lng,
              };
            });
          }}
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
              <p className="p-bold">Address: {info.name}</p>
            </Col>
          </Row>
        ) : (
          <div>
            <p className="p-bold">No Address</p>
          </div>
        )}
      </div>
      <ToastContainer />
    </AddForm>
  );
}
