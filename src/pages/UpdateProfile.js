import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../states/store";
import { reducer } from "../states/reducers";
import { getProfile, updateProfile } from "../states/actions";
import { EditForm, TextInput } from "../components";
import { uploadFile } from "../utils/uploadImage";
import { Col, ProgressBar, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { UploadFileComp } from "../components/layout";

export default function EditUserModel(props) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { token } = state;

  const [{ loading, error, loadingUpdate, data: user, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const userData = {
    email: "",
    profile_url: "",
    firstname: "",
    lastname: "",
    mobile_no: "",
    password: ""
  };
  const userAttr = [
    {
      type: "text",
      props: {
        label: "Firstname",
        name: "firstname",
        required: true
      }
    },
    {
      type: "text",
      props: {
        label: "Lastname",
        name: "lastname",
        required: true
      }
    },
    {
      type: "text",
      props: {
        label: "Email",
        name: "email",
        required: true,
      }
    },
    {
      type: "text",
      props: {
        label: "Mobile No.",
        name: "mobile_no",
        required: true
      }
    },
    {
      type: "text",
      col: 12,
      props: {
        label: "Password",
        name: "password"
      }
    },
  ]
  const [info, setInfo] = useState(userData);
  const [profileImg, setProfileImg] = useState();
  const handleImageChange = (location) => {
    setInfo({ ...info, profile_url: location });
    setProfileImg(location);
  }

  useEffect(() => {
    if (user) {
      console.log({ user })
      setInfo({
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        mobile_no: user.mobile_no,
        profile_url: user.profile_url
      });
      setProfileImg(user.profile_url);
    }

    (async () => {
      await getProfile(dispatch, token);
    })();
  }, [token, props.show]);

  const resetForm = () => {
    setProfileImg("");
    setInfo(userData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await updateProfile(ctxDispatch, dispatch, token, info);
    if (success) {
      resetForm();
    }
  };

  return (
    <EditForm
      {...props}
      title="Update Profile"
      data={info}
      setData={setInfo}
      inputFieldProps={userAttr}
      submitHandler={submitHandler}
      target=""
      successMessage="Profile Updated Successfully! Redirecting..."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    >
      <UploadFileComp label="Upload Profile Image" accept="image/*" file={profileImg} setFile={handleImageChange} fileType="image" />
    </EditForm>
  );
}