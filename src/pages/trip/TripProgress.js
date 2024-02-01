import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { GoDotFill } from "react-icons/go";
import { getLocaleTime } from '../../utils/function'

const pStyle = {
  fontSize: '0.8rem',
  fontWeight: 500,
  color: 'rgba(0,0,0,0.8)',
  marginBottom: '0.2rem'
};

export default function TripProgress({ data }) {
  const [md, setMd] = useState('');

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setMd('md-');
    } else {
      setMd('')
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='my-3'>
      <h5>Trip Time Details</h5>
      <div className='step d-flex flex-column flex-md-row'>
        {Object.entries(data).map(([k, v]) => {
          const [d, t] = getLocaleTime(v);

          return (
            <div className={`step-${md}item${v ? ' active' : ''}`}>
              <div className={`step-${md}item-dot`}></div>
              <div className={`step-${md}item-border`}></div>
              <div className={`step-${md}item-content`}>
                <p style={{ ...pStyle, fontSize: `${!md ? '1' : '0.8'}rem` }}>{k}</p>
                <p style={pStyle}>{d}</p>
                <p style={pStyle}>{t}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div >
  );
}
