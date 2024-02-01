import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useNavigate, useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";
import EditMillModel from "./EditMill";

const keyProps = {
  Name: "mill_name",
  Address: "address",
  "Created At": "createdAt",
  "Last Update": "updatedAt",
};

const ViewMill = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // mill/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, mill }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  console.log({ error, mill });
  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  useTitle("Mill Details");
  return (
    <ViewCard
      title={"Mill Details"}
      data={mill && { ...mill, address: mill.address?.name }}
      setModalShow={setModalShow}
      keyProps={keyProps}
      reducerProps={{ error, loading, dispatch }}
      isEdit={false}
    >
      <EditMillModel show={modalShow} onHide={() => setModalShow(false)} />
      {!modalShow && <ToastContainer />}
    </ViewCard>
  );
};

export default ViewMill;
