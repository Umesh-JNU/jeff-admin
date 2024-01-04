
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { clearErrors } from "../../states/actions";
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

export default function Users() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const curPageHandler = (p) => setCurPage(p);

  const [{ loading, error, users, userCount }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });
  console.log({ users })
  const deleteUser = async (id) => {
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
  }, [error]);

  const numOfPages = Math.ceil(userCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);
  // console.log("nuofPage", numOfPages, resultPerPage);

  const column = [
    "S.No",
    "Image",
    "Firstname",
    "Lastname",
    "Mobile No.",
    "Actions",
  ];

  useTitle("Users");
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
          //   createURL: "/admin/wholesaler/create",
          //   text: "Wholesaler"
          // }}
          isTitle="true"
          title="Drivers"
        >
          {users && users.length > 0 &&
            users.map((user, i) => (
              <tr key={user._id} className="odd">
                <td className="text-center">{skip + i + 1}</td>
                <td>
                  <img className="td-img" src={user.profile_url} alt="img" />
                </td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.mobile_no}</td>
                <td>
                  <ViewButton
                    onClick={() => navigate(`/admin/view/driver/${user._id}`)}
                  />
                  <DeleteButton onClick={() => deleteUser(user._id)} />
                </td>
              </tr>
            ))}
        </CustomTable>
      )}
      <ToastContainer />
    </MotionDiv>
  );
}
