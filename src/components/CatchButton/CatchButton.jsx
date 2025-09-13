import PropTypes from 'prop-types';
import './CatchButton.css';

const CatchButton = ({ onClick, disabled }) => (
  <button className="catch-button" onClick={onClick} disabled={disabled}>
    Catch the answer
  </button>
);

CatchButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default CatchButton;
