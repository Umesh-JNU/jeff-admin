import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";
import { EditForm, MapScreen, RadioInput, UploadFileComp } from "../../components";
import { toast } from "react-toastify";
import { toastOptions } from "../../utils/error";
import { Col, Row } from "react-bootstrap";

export default function EditLocationModel(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // location/:id

  const [{ loading, error, loadingUpdate, location, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const locationData = {
    name: "",
    lat: "",
    long: ""
  };

  const [info, setInfo] = useState(locationData);

  useEffect(() => {
    if (location && location._id === id) {
      console.log({ location })
      setInfo({
        name: location.name,
        lat: location.lat,
        long: location.long
      });
    }

    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [id, props.show]);

  const resetForm = () => {
    setInfo(locationData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // if (!locationImage) {
    //   toast.warning("Please select an image or wait till image is uploaded.", toastOptions);
    //   return;
    // }

    await update(dispatch, token, id, info);
    if (success) {
      resetForm();
    }
  };

  return (
    <EditForm
      {...props}
      title="Edit Location"
      data={info}
      setData={() => { }}
      inputFieldProps={[]}
      submitHandler={submitHandler}
      target="/admin/location"
      successMessage="Location Updated Successfully! Redirecting..."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
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
          setLat={(latitude) => {
            setInfo({ ...info, lat: latitude });
          }}
          setLong={(longitude) => {
            setInfo({ ...info, long: longitude });
          }}
          setAddr={(addr) => {
            setInfo({ ...info, name: addr });
          }}
        ></MapScreen>
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
    </EditForm>
  );
}