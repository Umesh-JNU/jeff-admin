
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { clearErrors } from "../../states/actions";
import { useNavigate, useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import {
  MessageBox,
  useTitle,
  MotionDiv,
  ViewButton,
  DeleteButton,
  CustomSkeleton,
} from "../../components";
import reducer from "./state/reducer";
import { getAllUserLog, del } from "./state/action";
import { toastOptions } from "../../utils/error";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";

export default function UserTimeTracker() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // user/:id

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const [from, setFrom] = useState(`${year}-${month}-01`);
  const [to, setTo] = useState(today.toISOString().slice(0, 10));
  const [query, setQuery] = useState({
    from,
    to
  });

  const [{ loading, error, userLogs, user }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });
  console.log({ userLogs, user })
  const deleteUser = async (id) => {
    await del(dispatch, token, id);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllUserLog(dispatch, token, id, query)
    }
    fetchData();
  }, [token, id, query]);

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }
  }, [error]);

  const column = [
    "S.No",
    "Check In",
    "Check Out",
    "Time",
    // "Actions",
  ];

  useTitle("Time Tracker");
  return (
    <MotionDiv>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Card>
          <Card.Header>
            <h3 className="mb-0">{`${user?.firstname} ${user?.lastname} -Time Tracker`}</h3>
          </Card.Header>
          <Card.Body>
            <Row className="mb-3">
              <Col md={5}>
                <Form.Control
                  aria-label="Search Input"
                  type="date"
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value);
                  }}
                />
              </Col>
              <Col md={5}>
                <Form.Control
                  aria-label="Search Input"
                  type="date"
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value);
                  }}
                />
              </Col>
              <Col md={2}>
                <Button onClick={() => {
                  setQuery({ from, to });
                }}>Apply</Button>
              </Col>
            </Row>
            <Table responsive striped bordered hover>
              <thead>
                <tr>{column.map((col) => <th key={col}>{col}</th>)}</tr>
              </thead>
              <tbody>

                {loading ? (
                  <CustomSkeleton resultPerPage={10} column={4} />
                ) : (
                  userLogs && userLogs.length > 0 &&
                  userLogs.map((log, i) => (
                    <tr key={log._id} className="odd">
                      <td className="text-center">{i + 1}</td>
                      <td>{`${log.checkInDate} ${log.start}`}</td>
                      <td>{`${log.checkOutDate} ${log.end}`}</td>
                      <td>{log.time}</td>
                      {/* <td>
                        <ViewButton
                          onClick={() => navigate(`/admin/view/driver/${log._id}`)}
                        />
                        <DeleteButton onClick={() => deleteUser(log._id)} />
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
      <ToastContainer />
    </MotionDiv>
  );
}
