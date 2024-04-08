import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { Link, useParams } from "react-router-dom";
import { LiveMap, MotionDiv, useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";
// import EdittripModel from "./Edittrip";
import { Col, Row, Table } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import TripProgress from "./TripProgress";

const keyProps = {
  "Start Loc.": "source_loc",
  "Start Milage": "start_milage",
  "Load Loc.": "load_loc",
  "Load Milage": "load_milage",
  "Unload Loc.": "unload_loc",
  "Unload Milage": "unload_milage",
  "End Loc.": "end_loc",
  "End Milage": "end_milage",
  Dispatch: "dispatch",
  "Start Milage": "start_milage",
  "End Milage": "end_milage",
  Status: "status",
  "Created At": "createdAt",
  "Last Update": "updatedAt",
};

const Details = ({ title, loading, data, detailKey, fields }) => {
  console.log({ data });
  if (!data || !data[detailKey]) return;

  const keyList = Object.entries(fields);

  // console.log({ loading, data, detailKey, fields })
  // console.log({ a: data[detailKey] })
  return (
    <>
      <u>
        <h4 className="mt-3">{title}</h4>
      </u>
      <Row>
        {keyList &&
          keyList.map(([k, attr]) => {
            // console.log({ k, attr })
            return (
              <Col key={k} md={4}>
                <p className="mb-0">
                  <strong>{k}</strong>
                </p>
                <p>{loading ? <Skeleton /> : data[detailKey][attr]}</p>
              </Col>
            );
          })}
      </Row>
    </>
  );
};

const ViewTrip = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // trip/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, trip, subTrip }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const getSourceDest = () => {
    if (trip) {
      if (trip.unload_depart_time) {
        return {
          source: trip.unload_loc.address,
          dest: trip.end_loc
        }
      } else if (trip.unload_loc) {
        return {
          source: trip.load_loc,
          dest: trip.unload_loc.address
        }
      }
      else if (trip.load_loc) {
        return {
          source: trip.source_loc,
          dest: trip.load_loc
        }
      }
    }
  }

  const getTrip = () => {
    return { ...trip, source_loc: trip.source_loc?.name, load_loc: trip.load_loc?.name, unload_loc: trip.unload_loc?.address?.name, end_loc: trip.end_loc?.name };
  };
  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  useTitle("Trip Details");

  return (
    <ViewCard
      title={"Trip Details"}
      data={trip && getTrip()}
      // setModalShow={setModalShow}
      keyProps={keyProps}
      reducerProps={{ error, loading, dispatch }}
      isEdit={false}
      child={
        <>
          {trip?.status === "on-going" ?
            <LiveMap {...getSourceDest()} />
            : <></>
          }

          <TripProgress
            data={{
              "Trip Started": trip?.createdAt,
              Arrived: trip?.load_loc_arr_time,
              "Start Load": trip?.load_time_start,
              "End Load": trip?.load_time_end,
              "Arrived Mill": trip?.unload_loc_arr_time,
              "Start Un-Load": trip?.unload_time_start,
              "End Un-Load": trip?.unload_time_end,
              "End Trip": trip?.end_time,
            }}
          />
        </>
      }
    >
      {trip?.unload_loc && <Details
        title="Mill"
        loading={loading}
        data={trip && { unload_loc: { block: trip.block_no, mill_name: trip.unload_loc?.mill_name, address: trip.unload_loc?.address?.name } }}
        detailKey="unload_loc"
        fields={{
          "Name": "mill_name",
          "Address": "address",
          "Block Num.": "block"
        }}
      />}

      <Details
        title="Truck Detail"
        loading={loading}
        data={trip}
        detailKey="truck"
        fields={{
          "Truck ID": "truck_id",
          "Plate No.": "plate_no",
          Name: "name",
        }}
      />

      {trip?.net_wt && <Details
        title="Product Detail"
        loading={loading}
        data={{ trip }}
        detailKey="trip"
        fields={{
          "Product Details": "prod_detail",
          "Gross Wt.": "gross_wt",
          "Net Wt.": "net_wt",
          "Tare Wt.": "tare_wt",
          "Slip Id": "slip_id"
        }}
      />}

      <Row>
        <Col md={6}>
          <u><h4>Drivers</h4></u>
          {loading ? <Skeleton count={3} height={20} /> :
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile No.</th>
                </tr>
              </thead>
              <tbody>
                {trip?.driver?.map(({ dId }) => (
                  <tr key={dId._id}>
                    <td><Link to={`/admin/view/driver/${dId._id}`} >{`${dId.firstname} ${dId.lastname}`}</Link></td>
                    <td>{`${dId.country_code}-${dId.mobile_no}`}</td>
                  </tr>
                ))}
              </tbody>
            </Table>}
        </Col>
        <Col md={6}>
          <u><h4>Documents</h4></u>
          {loading ? <Skeleton count={3} height={20} /> :
            <Row>
              {trip?.docs.map((url) => (
                <Col md={4} key={url}>
                  <img className="img-fluid" src={url} alt={url} />
                </Col>
              ))}
            </Row>}
        </Col>
      </Row>

      {/* <EdittripModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {!modalShow && <ToastContainer />} */}
    </ViewCard>
  );
};

export default ViewTrip;
