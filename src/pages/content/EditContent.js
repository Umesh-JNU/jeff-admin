import React, { useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Store } from "../../states/store";
import { useParams, useSearchParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getContent, getDetails, update } from "./state/action";
import { AddForm, EditForm } from "../../components";
import { ToastContainer } from "react-toastify";
import JoditEditor from "jodit-react";
import Skeleton from "react-loading-skeleton";

export default function EditContent() {
  const { state } = useContext(Store);
  const { token } = state;

  const [searchParams, _] = useSearchParams(document.location.search);
  const contentType = searchParams.get('TYPE');
  const title = contentType === 'TC' ? 'Terms & Conditions' : 'Privacy Policy';

  const [{ loading, error, loadingUpdate, content, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const editor = useRef();
  const [value, setValue] = useState();
  const config = useMemo(() => ({
    readonly: false, // all options from https://xdsoft.net/jodit/docs/,
    placeholder: 'Write your content here...'
  }), []);

  useEffect(() => {
    (async () => {
      await getContent(dispatch, token);
    })();
  }, []);

  useEffect(() => {
    if (content) {
      console.log({ content })
      setValue(content[contentType === 'TC' ? 'tc' : 'pp']);
    }
  }, [content]);

  const resetForm = () => setValue("");

  const submitHandler = async (e) => {
    e.preventDefault();

    await update(dispatch, token, contentType === 'TC' ? { tc: value } : { pp: value });
    if (success) {
      resetForm();
    }
  };

  return (
    <AddForm
      title={`Edit ${title}`}
      data={{}}
      setData={() => { }}
      inputFieldProps={[]}
      submitHandler={submitHandler}
      target="/admin/contents"
      successMessage={`${title} Updated Successfully! Redirecting...`}
      reducerProps={{ loading: loadingUpdate, error, success, dispatch }}
    >
      {loading ? <Skeleton count={5} height={40} /> : <JoditEditor
        ref={editor}
        value={value}
        config={config}
        tabIndex={1} // tabIndex of textarea
        // onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
        onChange={newContent => setValue(newContent)}
      />}
      {/* {content} */}
      <ToastContainer />
    </AddForm>
  );
}