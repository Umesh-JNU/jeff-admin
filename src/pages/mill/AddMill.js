import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";

import { ToastContainer, toast } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, AddForm } from "../../components";

export default function AddMill() {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, error, success }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const millData = {
    mill_id: "",
  };
  const millAttr = [
    {
      type: "text",
      col: 12,
      props: {
        label: "Mill ID",
        name: "mill_id",
        maxLength: 50,
        minLength: 4,
        required: true
      }
    }
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
      <ToastContainer />
    </AddForm>
  );
}