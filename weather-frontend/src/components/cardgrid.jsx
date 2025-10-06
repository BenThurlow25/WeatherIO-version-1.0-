import React from 'react';
import './cardgrid.css'; // External styling for layout

const CardGrid = ({ children }) => {
  return <div className="card-grid">{children}</div>;
};

export default CardGrid;
