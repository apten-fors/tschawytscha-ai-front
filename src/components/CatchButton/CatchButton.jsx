import React from 'react';
import './CatchButton.css';

const CatchButton = ({ onClick }) => (
  <button className="catch-button" onClick={onClick}>
    Catch the answer
  </button>
);

export default CatchButton;
