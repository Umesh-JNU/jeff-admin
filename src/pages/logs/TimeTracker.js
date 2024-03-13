
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { clearErrors } from "../../states/actions";
import { useNavigate } from "react-router-dom";

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
import { getAll, del } from "./state/action";
import { toastOptions } from "../../utils/error";
import { Card, Form, Table } from "react-bootstrap";

export default function TimeTracker() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const [{ loading, error, logs }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });
  console.log({ logs })
  const deleteUser = async (id) => {
    await del(dispatch, token, id);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAll(dispatch, token, date)
    }
    fetchData();
  }, [token, date]);

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }
  }, [error]);

  const column = [
    "S.No",
    "Driver",
    "Check In",
    "Check Out",
    "Time",
    "Actions",
  ];

  useTitle("Time Tracker");
  return (
    <MotionDiv>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Card>
          <Card.Header>
            <div className="search-box float-end">
              <Form.Control
                aria-label="Search Input"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>
            <h3 className="mb-0">Time Tracker</h3>
          </Card.Header>
          <Card.Body>
            <Table responsive striped bordered hover>
              <thead>
                <tr>{column.map((col) => <th key={col}>{col}</th>)}</tr>
              </thead>
              <tbody>

                {loading ? (
                  <CustomSkeleton resultPerPage={10} column={5} />
                ) : (
                  logs && logs.length > 0 &&
                  logs.map((log, i) => (
                    <tr key={log._id} className="odd">
                      <td className="text-center">{i + 1}</td>
                      <td>{`${log?.user?.firstname} ${log?.user?.lastname}`}</td>
                      <td>{log.start}</td>
                      <td>{log.end}</td>
                      <td>{log.time}</td>
                      <td>
                        <ViewButton
                          onClick={() => navigate(`/admin/time-tracker/dId/${log?.user?._id}`)}
                        />
                        <DeleteButton onClick={() => deleteUser(log._id)} />
                      </td>
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
