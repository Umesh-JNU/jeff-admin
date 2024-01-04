
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

export default function Location() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const curPageHandler = (p) => setCurPage(p);

  const [{ loading, error, locations, locationCount, success }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });
  console.log({ locations })
  const deleteLocation = async (id) => {
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
      toast.success("Location Deleted Successfully.", toastOptions);
      clearSuccess(dispatch);
    }
  }, [error, success]);

  const numOfPages = Math.ceil(locationCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);
  // console.log("nuofPage", numOfPages, resultPerPage);

  const column = [
    "S.No",
    "Name",
    "Latitude",
    "Longitude",
    "Actions",
  ];

  useTitle("Location");
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
          isCreateBtn="true"
          createBtnProps={{
            createURL: "/admin/location/create",
            text: "Location"
          }}
        // isTitle="true"
        // title="Users"
        >
          {locations && locations.length > 0 &&
            locations.map((location, i) => (
              <tr key={location._id} className="odd">
                <td className="text-center">{skip + i + 1}</td>
                <td>{location.name}</td>
                <td>{location.lat}</td>
                <td>{location.long}</td>
                <td>
                  <ViewButton
                    onClick={() => navigate(`/admin/view/location/${location._id}`)}
                  />
                  <DeleteButton onClick={() => deleteLocation(location._id)} />
                </td>
              </tr>
            ))}
        </CustomTable>
      )}
      <ToastContainer />
    </MotionDiv>
  );
}
