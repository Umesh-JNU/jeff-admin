import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";
import { EditForm } from "../../components";

export default function EditMillModel(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // mill/:id

  const [{ loading, error, loadingUpdate, mill, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
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

  useEffect(() => {
    if (mill && mill._id === id) {
      console.log({ mill })
      setInfo({ mill_id: mill.mill_id });
    }

    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [id, props.show]);

  const resetForm = () => {
    setInfo(millData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await update(dispatch, token, id, info);
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