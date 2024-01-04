import React, { useContext, useEffect, useReducer, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Store } from "../states/store";
import { reducer } from "../states/reducers";
import { getProfile } from "../states/actions";

import { useTitle, ViewCard } from "../components";
import EditProfileModel from "./UpdateProfile";
import { Col, Row } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";



const keyProps = {
  "Email": "email", "Firstname": "firstname", "Lastname": "lastname", "Mobile No.": "mobile_no", "Role": "role", "Created At": "createdAt", "Last Update": "updatedAt"
};

const ViewProfile = () => {
  const { state } = useContext(Store);
  const { token } = state;

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, data: user }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  console.log({ error, user })
  useEffect(() => {
    (async () => {
      await getProfile(dispatch, token);
    })();
  }, [token]);

  useTitle("Profile Details");
  return (
    <ViewCard
      title={"Profile Details"}
      data={user}
      setModalShow={setModalShow}
      keyProps={keyProps}
      isImage="true"
      image_url={user ? user.profile_url : ""}
      reducerProps={{ error, loading, dispatch }}
    >
      <EditProfileModel
        show={modalShow}
        onHide={() => setModalShow(false)}
        reload={async () => { await getProfile(dispatch, token) }}
      />
      {!modalShow && <ToastContainer />}
    </ViewCard>
  );
};

export default ViewProfile;