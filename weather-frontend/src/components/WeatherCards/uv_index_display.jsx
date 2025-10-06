import React from 'react';
import './uv_index_display.css'

const UvIndexCard = ({ data }) => {

  const severityClass =
  data <= 2 ? 'uv-low' :
  data <= 5 ? 'uv-moderate' :
  'uv-high';


  return (
    <div className={`uv-card ${severityClass}`}>
        <div className="forecast-item">
        <h4>UV Index</h4>
        <h1>{data}</h1>
        </div>
    </div>
  );
};

export default UvIndexCard;
