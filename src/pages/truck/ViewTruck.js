import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useNavigate, useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { CustomSkeleton, useTitle, ViewButton, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";
import EditTruckModel from "./EditTruck";
import { Col, Row, Table } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";

const keyProps = {
  "Truck ID": "truck_id", "Name": "name", "Plate No.": "plate_no", "Availability": "is_avail", "Created At": "createdAt", "Last Update": "updatedAt"
};


const ViewTruck = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // Truck/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, truck }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  console.log({ error, truck })
  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  useTitle("Truck Details");
  return (
    <ViewCard
      title={"Truck Details"}
      data={truck}
      setModalShow={setModalShow}
      keyProps={keyProps}
      reducerProps={{ error, loading, dispatch }}
    >
      <EditTruckModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {!modalShow && <ToastContainer />}
    </ViewCard>
  );
};

export default ViewTruck;