import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useNavigate, useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";

const keyProps = {
  "Message": "message", "User": "user", "Mobile No.": "mob", "Created At": "createdAt", "Last Update": "updatedAt"
};


const ViewMessage = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // message/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, message }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  console.log({ error, message })
  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  useTitle("Message Details");
  return (
    <ViewCard
      title={"Message Details"}
      data={message && { ...message, user: `${message.user?.firstname} ${message.user?.lastname}`, mob: message.user?.mobile_no }}
      setModalShow={setModalShow}
      keyProps={keyProps}
      reducerProps={{ error, loading, dispatch }}
      isImage={true}
      image_url={message?.image}
      isEdit={false}
    >
      <ToastContainer />
    </ViewCard>
  );
};

export default ViewMessage;