
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
  ArrayView,
  ViewButton,
  DeleteButton,
} from "../../components";
import reducer from "./state/reducer";
import { getAll, del } from "./state/action";
import { toastOptions } from "../../utils/error";
import { IoMdOpen } from "react-icons/io";
import { Col, Row } from "react-bootstrap";

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

  const [modalShow, setModalShow] = useState(false);
  const [milageList, setMilageList] = useState([]);
  const showModelHandler = ({ start_milage = '---', load_milage = '---', unload_milage = '---', end_milage = '---' }) => {
    setMilageList([
      { a: "Start Milage", b: start_milage },
      { a: "Load Milage", b: load_milage },
      { a: "Unload Milage", b: unload_milage },
      { a: "End Milage", b: end_milage },
    ]);
    setModalShow(true);
  }

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
    "Start Loc.",
    "Load Loc.",
    "Unload Loc.",
    "End Loc.",
    "Milage",
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
                  <td>{trip.source_loc?.name}</td>
                  <td>{trip.load_loc?.name}</td>
                  <td>{trip.unload_loc?.address?.name ? trip.unload_loc.address.name : '---'}</td>
                  <td>{trip.end_loc ? trip.end_loc.name : '---'}</td>
                  <td>
                    <IoMdOpen
                      className="open-model"
                      onClick={() => showModelHandler(trip)}
                    />
                  </td>
                  <td>{trip.truck?.truck_id}</td>
                  <td>
                    <ViewButton onClick={() => navigate(`/admin/view/trip/${trip._id}`)} />
                    <DeleteButton onClick={() => deleteTrip(trip._id)} />
                  </td>
                </tr>
              ))}
          </CustomTable>
        </>
      )}
      {milageList && modalShow ? (
        <ArrayView
          show={modalShow}
          onHide={() => setModalShow(false)}
          arr={milageList}
          column={{ "Milage": "a", "Value": "b" }}
          title="Milages"
        />
      ) : (
        <></>
      )}
      <ToastContainer />
    </MotionDiv >
  );
}
