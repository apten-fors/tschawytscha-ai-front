import PropTypes from 'prop-types';
import './Header.css';

const Header = ({ minimal = false }) => (
  <header className="header">
    <img src="/logo-new.png" alt="TSHAWYTSCHA AI" className="logo" />
    {!minimal && <img src="/fish.png" alt="Fish" className="fish-image" />}
  </header>
);

Header.propTypes = {
  minimal: PropTypes.bool,
};

export default Header;
