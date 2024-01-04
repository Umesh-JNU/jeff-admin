import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";
import { EditForm, RadioInput, TextInput, UploadFileComp } from "../../components";
import { toast } from "react-toastify";
import { toastOptions } from "../../utils/error";

export default function EditTruckModel(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // truck/:id

  const [{ loading, error, loadingUpdate, truck, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const truckData = {
    name: "",
    plate_no: "",
    is_avail: ""
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
    },
  ];

  const [info, setInfo] = useState(truckData);

  useEffect(() => {
    if (truck && truck._id === id) {
      console.log({ truck })
      setInfo({
        name: truck.name,
        plate_no: truck.plate_no,
        is_avail: truck.is_avail,
      });
    }

    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [id, props.show]);

  const resetForm = () => {
    setInfo(truckData);
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
      title="Edit Truck"
      data={info}
      setData={setInfo}
      inputFieldProps={truckAttr}
      submitHandler={submitHandler}
      target="/admin/trucks"
      successMessage="Truck Updated Successfully! Redirecting..."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    >
      <h6>Truck Availability</h6>
      <RadioInput label="Yes" name="is_avail" checked={info.is_avail} onChange={e => setInfo({ ...info, is_avail: true })} />
      <RadioInput label="No" name="is_avail" checked={!info.is_avail} onChange={e => setInfo({ ...info, is_avail: false })} />

    </EditForm>
  );
}