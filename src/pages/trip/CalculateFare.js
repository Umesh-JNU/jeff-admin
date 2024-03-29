import React, { useContext, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { MotionDiv, SubmitButton, TextInput } from '../../components';
import { Card, Col, Form, Row, Table } from 'react-bootstrap';
import axiosInstance from '../../utils/axiosUtil';
import { ToastContainer, toast } from 'react-toastify';
import { getError, toastOptions } from '../../utils/error';
import { Store } from '../../states/store';

export default function CalculateFare() {
  const { state } = useContext(Store);
  const { token } = state;

  const [searchParams, _] = useSearchParams(document.location.search);
  const start_milage = searchParams.get('START_MILAGE');
  const load_milage = searchParams.get('LOAD_MILAGE');
  const unload_milage = searchParams.get('UNLOAD_MILAGE');
  const end_milage = searchParams.get('END_MILAGE');
  console.log({ start_milage, load_milage, unload_milage, end_milage });

  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState();
  const [fuel_eff, setFuel_eff] = useState();
  const [fuel_price, setFuel_price] = useState();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post("/api/admin/calc-charge", {
        start_milage, load_milage, unload_milage, end_milage, fuel_eff, fuel_price
      }, {
        headers: {
          Authorization: token
        }
      });

      console.log({ data })

      setPrice(data.price);
      setIsLoading(false);
    } catch (error) {
      toast.error(getError(error), toastOptions);
      setIsLoading(false);
    }
  }

  return (
    <MotionDiv>
      <Card>
        <Card.Header>Calculate Charge</Card.Header>
        <Card.Body>
          <Table responsive striped bordered hover style={{ maxWidth: '400px' }}>
            <thead>
              <tr>
                <th>Milage</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='p-bold'>Start Milage</td>
                <td>{start_milage ? start_milage : 'not covered yet'}</td>
              </tr>
              <tr>
                <td className='p-bold'>Load Milage</td>
                <td>{load_milage && load_milage !== 'undefined' ? load_milage : 'not covered yet'}</td>
              </tr>
              <tr>
                <td className='p-bold'>Unload Milage</td>
                <td>{unload_milage && unload_milage !== 'undefined' ? unload_milage : 'not covered yet'}</td>
              </tr>
              <tr>
                <td className='p-bold'>End Milage</td>
                <td>{end_milage && end_milage !== 'undefined' ? end_milage : 'not covered yet'}</td>
              </tr>
            </tbody>
          </Table>

          <Form onSubmit={submitHandler}>
            <Row className='mt-4'>
              <Col md={4}>
                <TextInput
                  label="Fuel Efficiency"
                  placeholder="in liters / km"
                  min={0}
                  required={true}
                  type="number"
                  onChange={(e) => setFuel_eff(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <TextInput
                  label='Gas/Fuel Price ($)'
                  placeholder="per liter"
                  min={0}
                  required={true}
                  type="number"
                  onChange={(e) => setFuel_price(e.target.value)}
                />
              </Col>
              <Col className='align-content-end'>
                <SubmitButton className="mb-3" variant="success" loading={isLoading} disabled={isLoading}>Submit</SubmitButton>
              </Col>
            </Row>
          </Form>

          <p className='mt-2 mb-0'>
            <span className='p-bold m-0'>Total Charge:</span>
            <span style={{
              borderBottom: '2px dashed',
              minWidth: '100px',
              display: 'inline-block',
              marginLeft: '1rem',
              textAlign: 'center'
            }}>{price}</span>
          </p>
        </Card.Body>
      </Card>
      <ToastContainer />
    </MotionDiv>
  )
}
