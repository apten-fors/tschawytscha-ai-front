import React from 'react';
import './Header.css';

const Header = ({ minimal = false }) => (
  <header className="header">
    <img src="/logo.png" alt="TSHAWYTSCHA AI" className="logo" />
    {!minimal && <img src="/fish.png" alt="Fish" className="fish-image" />}
  </header>
);

export default Header;
