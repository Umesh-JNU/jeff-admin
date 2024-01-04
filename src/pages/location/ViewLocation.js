import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";
import EditLocationModel from "./EditLocation";

const keyProps = {
  "Name": "name", "Latitude": "lat", "Longitude": "long", "Created At": "createdAt", "Last Update": "updatedAt"
};

const ViewLocation = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // location/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, location }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  // console.log({ error, location })
  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  useTitle("Location Details");
  return (
    <ViewCard
      title={"Location Details"}
      data={location}
      setModalShow={setModalShow}
      keyProps={keyProps}
      reducerProps={{ error, loading, dispatch }}
    >
      <EditLocationModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {!modalShow && <ToastContainer />}
    </ViewCard>
  );
};

export default ViewLocation;