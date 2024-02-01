
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
  SelectInput,
} from "../../components";
import reducer from "./state/reducer";
import { getAll, del } from "./state/action";
import { toastOptions } from "../../utils/error";
import { Col, Form, Row } from "react-bootstrap";

export default function Trips() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [status, setStatus] = useState("on-going");
  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const curPageHandler = (p) => setCurPage(p);

  const [{ loading, error, trips, tripCount }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });
  console.log({ trips })
  const deleteTrip = async (id) => {
    await del(dispatch, token, id);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAll(dispatch, token, status, curPage, resultPerPage, query)
    }
    fetchData();
  }, [token, status, curPage, resultPerPage, query]);

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }
  }, [error]);

  const numOfPages = Math.ceil(tripCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);
  // console.log("nuofPage", numOfPages, resultPerPage);

  const column = [
    "S.No",
    "Source",
    "Destination",
    "Driver",
    "Truck ID",
    "Actions",
  ];

  useTitle("Trips");
  return (
    <MotionDiv>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row
            className="mb-3 pb-2"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.5)" }}
          >
            <Col md={6}>
              <h3>Trips</h3>
            </Col>
            <Col md={6}>
              <div className="float-md-end d-flex align-items-center">

                <p className="p-bold m-0 me-3">Select Trip</p>
                <div>
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                    aria-label="Default select example"
                  >
                    <option key="blankChoice" hidden value>
                      Select Trip
                    </option>
                    <option value="on-going">On-going</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </Col>
          </Row>

          <CustomTable
            loading={loading}
            column={column}
            rowNo={resultPerPage}
            rowProps={{ setResultPerPage }}
            paging={numOfPages > 0}
            pageProps={{ numOfPages, curPage }}
            pageHandler={curPageHandler}
            search={false}
            // searchProps={{ searchInput, setSearchInput, setQuery }}
            // isCreateBtn="true"
            // createBtnProps={{
            //   createURL: "/admin/wholesaler/create",
            //   text: "Wholesaler"
            // }}
            isTitle="true"
            title={`${status === 'on-going' ? " On-going Trips" : "Completed Trips"}`}
          >
            {trips && trips.length > 0 &&
              trips.map((trip, i) => (
                <tr key={trip._id} className="odd">
                  <td className="text-center">{skip + i + 1}</td>
                  <td>{trip.sub_trip?.source ? trip.sub_trip.source.name : trip.source.name}</td>
                  <td>{trip.sub_trip?.dest ? trip.sub_trip.dest.name : trip.dest.name}</td>
                  <td>{trip.driver_name}</td>
                  <td>{trip.truck.truck_id}</td>
                  <td>
                    <ViewButton onClick={() => navigate(`/admin/view/trip/${trip._id}`)} />
                    <DeleteButton onClick={() => deleteTrip(trip._id)} />
                  </td>
                </tr>
              ))}
          </CustomTable>
        </>
      )
      }
      <ToastContainer />
    </MotionDiv >
  );
}
