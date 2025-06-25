import PropTypes from 'prop-types';
import './CatchButton.css';

const CatchButton = ({ onClick }) => (
  <button className="catch-button" onClick={onClick}>
    Catch the answer
  </button>
);

CatchButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CatchButton;
