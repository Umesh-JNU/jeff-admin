import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";

import { ToastContainer, toast } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, AddForm, UploadFileComp, RadioInput } from "../../components";
import { toastOptions } from "../../utils/error";

export default function AddTruck() {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, error, success }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const truckData = {
    name: "",
    plate_no: "",
  };
  const truckAttr = [
    {
      type: "text",
      col: 12,
      props: {
        label: "Name",
        name: "name",
        maxLength: 50,
        minLength: 4,
        required: true
      }
    },
    {
      type: "text",
      col: 12,
      props: {
        label: "Plate Number",
        name: "plate_no",
        maxLength: 20,
        minLength: 4,
        required: true
      }
    }
  ];
  const [info, setInfo] = useState(truckData);

  const resetForm = () => {
    setInfo(truckData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await create(dispatch, token, info);
    resetForm();
  };

  useTitle("Create Truck");
  return (
    <AddForm
      title="Add Truck"
      data={info}
      setData={setInfo}
      inputFieldProps={truckAttr}
      submitHandler={submitHandler}
      target="/admin/trucks"
      successMessage="Truck Created Successfully!"
      reducerProps={{ loading, error, success, dispatch }}
    >
      <ToastContainer />
    </AddForm>
  );
}