
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

export default function Truck() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const curPageHandler = (p) => setCurPage(p);

  const [{ loading, error, trucks, truckCount, success }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const deleteTruck = async (id) => {
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
      toast.success("Truck Deleted Successfully.", toastOptions);
      clearSuccess(dispatch);
    }
  }, [error, success]);

  const numOfPages = Math.ceil(truckCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);
  // console.log("nuofPage", numOfPages, resultPerPage);

  const column = [
    "S.No",
    "Truck ID",
    "Name",
    "Plate No.",
    "Actions",
  ];

  useTitle("Truck");
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
            createURL: "/admin/truck/create",
            text: "Truck"
          }}
        // isTitle="true"
        // title="Users"
        >
          {trucks && trucks.length > 0 &&
            trucks.map((Truck, i) => (
              <tr key={Truck._id} className="odd">
                <td className="text-center">{skip + i + 1}</td>
                <td>{Truck.truck_id}</td>
                <td>{Truck.name}</td>
                <td>{Truck.plate_no}</td>
                <td>
                  <ViewButton
                    onClick={() => navigate(`/admin/view/truck/${Truck._id}`)}
                  />
                  <DeleteButton onClick={() => deleteTruck(Truck._id)} />
                </td>
              </tr>
            ))}
        </CustomTable>
      )}
      <ToastContainer />
    </MotionDiv>
  );
}
