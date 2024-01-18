import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";
import { EditForm } from "../../components";

export default function EditMillModel(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id: millId } = useParams();  // mill/:id

  const [{ loading, error, loadingUpdate, mill, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const millData = {
    id: "",
  };
  const millAttr = [
    {
      type: "text",
      col: 12,
      props: {
        label: "Mill ID",
        name: "id",
        maxLength: 50,
        minLength: 4,
        required: true
      }
    }
  ];
  const [info, setInfo] = useState(millData);

  useEffect(() => {
    if (mill && mill._id === millId) {
      console.log({ mill })
      setInfo({ id: mill.id });
    }

    (async () => {
      await getDetails(dispatch, token, millId);
    })();
  }, [millId, props.show]);

  const resetForm = () => {
    setInfo(millData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await update(dispatch, token, millId, info);
    if (success) {
      resetForm();
    }
  };

  return (
    <EditForm
      {...props}
      title="Edit Mill"
      data={info}
      setData={setInfo}
      inputFieldProps={millAttr}
      submitHandler={submitHandler}
      target="/admin/mills"
      successMessage="Mill Updated Successfully! Redirecting..."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    />
  );
}