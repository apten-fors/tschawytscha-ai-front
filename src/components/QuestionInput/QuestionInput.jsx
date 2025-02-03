import React from 'react';
import './QuestionInput.css';

const QuestionInput = ({ value, onChange, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="input-wrapper" onSubmit={handleSubmit}>
      <div className="input-container">
        <input
          type="text"
          className="question-input"
          placeholder="Type your question here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
};

export default QuestionInput;
