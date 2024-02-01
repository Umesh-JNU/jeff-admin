
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { clearErrors, clearSuccess } from "../../states/actions";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import {
  MessageBox,
  useTitle,
  MotionDiv,
  CustomTable,
  ViewButton,
  DeleteButton,
} from "../../components";
import reducer from "./state/reducer";
import { getAll, del } from "./state/action";
import { toastOptions } from "../../utils/error";

export default function Message() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const curPageHandler = (p) => setCurPage(p);

  const [{ loading, error, messages, messageCount, success }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const deleteMessage = async (id) => {
    await del(dispatch, token, id);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAll(dispatch, token, curPage, resultPerPage, query)
    }
    fetchData();
  }, [token, curPage, resultPerPage, query]);

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }

    if (success) {
      toast.success("message Deleted Successfully.", toastOptions);
      clearSuccess(dispatch);
    }
  }, [error, success]);

  const numOfPages = Math.ceil(messageCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);
  console.log("nuofPage", numOfPages, resultPerPage, messageCount);

  const column = [
    "S.No",
    "Message",
    "User",
    "Actions",
  ];

  useTitle("message");
  return (
    <MotionDiv>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <CustomTable
          loading={loading}
          column={column}
          rowNo={resultPerPage}
          rowProps={{ setResultPerPage }}
          paging={numOfPages > 0}
          pageProps={{ numOfPages, curPage }}
          pageHandler={curPageHandler}
          search={true}
          searchProps={{ searchInput, setSearchInput, setQuery }}
          // isCreateBtn="true"
          // createBtnProps={{
          //   createURL: "/admin/message/create",
          //   text: "message"
          // }}
          isTitle="true"
          title="Messages"
        >
          {messages && messages.length > 0 &&
            messages.map((message, i) => (
              <tr key={message._id} className="odd">
                <td className="text-center">{skip + i + 1}</td>
                <td>{message.message}</td>
                <td>{message.user?.firstname + ' ' + message.user?.lastname}</td>
                <td>
                  <ViewButton
                    onClick={() => navigate(`/admin/view/message/${message._id}`)}
                  />
                  <DeleteButton onClick={() => deleteMessage(message._id)} />
                </td>
              </tr>
            ))}
        </CustomTable>
      )}
      <ToastContainer />
    </MotionDiv>
  );
}
