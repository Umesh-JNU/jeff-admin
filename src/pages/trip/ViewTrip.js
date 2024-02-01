import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import { LiveMap, MotionDiv, useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";
// import EdittripModel from "./Edittrip";
import { Col, Row } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import TripProgress from "./TripProgress";

const keyProps = {
  "Source": "source", "Destination": "dest", "Description": "desc", "Dispatch": "dispatch", "Driver": "driver_name", "Driver's Mobile No.": "driver_mob_no", "Start Milage": "start_milage", "End Milage": "end_milage", "Status": "status", "Created At": "createdAt", "Last Update": "updatedAt"
};

const Details = ({ title, loading, data, detailKey, fields }) => {
  console.log({ data })
  if (!data || !data[detailKey]) return;

  const keyList = Object.entries(fields);

  // console.log({ loading, data, detailKey, fields })
  // console.log({ a: data[detailKey] })
  return (
    <>
      <u><h4 className="mt-3">{title}</h4></u>
      <Row>
        {keyList && keyList.map(([k, attr]) => {
          // console.log({ k, attr })
          return (
            <Col key={k} md={4}>
              <p className="mb-0">
                <strong>{k}</strong>
              </p>
              <p>{loading ? <Skeleton /> : data[detailKey][attr]}</p>
            </Col>
          )
        })}
      </Row>
    </>
  )
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

  const getTrip = () => {
    if (trip.sub_trip) {
      return { ...trip, source: trip.sub_trip.source.name, dest: trip.sub_trip.dest.name };
    }
    return { ...trip, source: trip.source.name, dest: trip.dest.name };
  }
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
          {trip?.status === 'on-going'
            ? trip.sub_trip
              ? <LiveMap source={trip?.sub_trip?.source} dest={trip?.sub_trip?.dest} />
              : <LiveMap source={trip?.source} dest={trip?.dest} />
            : <></>
          }

          <TripProgress data={{
            "First Trip Started": trip?.createdAt,
            "Arrived": trip?.arrival_time,
            "Start Load": trip?.load_time_start,
            "End Load": trip?.load_time_end,
            "Second Trip Started": subTrip?.createdAt,
            "Arrived Mill": subTrip?.arrival_time,
            "Start Un-Load": subTrip?.unload_time_start,
            "End Un-Load": subTrip?.unload_time_end,
            "End Trip": trip?.end_time
          }} />
        </>
      }
    >
      <Details
        title="Truck Detail"
        loading={loading}
        data={trip}
        detailKey="truck"
        fields={{ "Truck ID": "truck_id", "Plate No.": "plate_no", "Name": "name" }}
      />

      <Details
        title="Product Detail"
        loading={loading}
        data={{ sub_trip: subTrip }}
        detailKey="sub_trip"
        fields={{ "Product Details": "prod_detail", "Gross Wt.": "gross_wt", "Net Wt.": "net_wt", "Tare Wt.": "tare_wt" }}
      />

      <Details
        title=""
        loading={loading}
        data={subTrip ? { sub_trip: { ...subTrip, mill: subTrip?.mill?.id } } : subTrip}
        detailKey="sub_trip"
        fields={{ "Mill ID": "mill", "Slip ID": "slip_id", "Block Name": "block_name" }}
      />

      {/* <EdittripModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {!modalShow && <ToastContainer />} */}
    </ViewCard>
  );
};

export default ViewTrip;