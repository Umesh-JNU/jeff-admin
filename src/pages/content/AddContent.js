import React, { useContext, useMemo, useReducer, useRef, useState } from "react";
import { Store } from "../../states/store";
import { useSearchParams } from "react-router-dom";
import JoditEditor from 'jodit-react';

import { ToastContainer, toast } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, AddForm } from "../../components";

export default function AddContent() {
  const { state } = useContext(Store);
  const { token } = state;

  const [searchParams, _] = useSearchParams(document.location.search);
  const contentType = searchParams.get('TYPE');
  const title = contentType === 'TC' ? 'Terms & Conditions' : 'Privacy Policy';

  const [{ loading, error, success }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const editor = useRef();
  const [content, setContent] = useState();
  const config = useMemo(() => ({
    readonly: false, // all options from https://xdsoft.net/jodit/docs/,
    placeholder: 'Write your content here...'
  }), []);

  const resetForm = () => setContent("");

  const submitHandler = async (e) => {
    e.preventDefault();

    await create(dispatch, token,
      contentType === 'TC' ? { tc: content } : { pp: content }
    );
    resetForm();
  };

  useTitle(`Content | ${title}`);
  return (
    <AddForm
      title={`Add ${title}`}
      data={{}}
      setData={() => { }}
      inputFieldProps={[]}
      submitHandler={submitHandler}
      target="/admin/contents"
      successMessage={`${title} Created Successfully!`}
      reducerProps={{ loading, error, success, dispatch }}
    >
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1} // tabIndex of textarea
        // onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
        onChange={newContent => setContent(newContent)}
      />
      {/* {content} */}
      <ToastContainer />
    </AddForm>
  );
}